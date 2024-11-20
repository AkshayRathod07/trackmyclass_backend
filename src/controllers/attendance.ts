import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import User, { IUser } from '../models/User';
import Sessions from '../models/Sessions';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../middleware/auth';
import Lecture from '../models/Lecture';
import Organization from '../models/Organization';

const createAttendanceSchema = z.object({
  sessionId: z.string(),

  attendedLectures: z.number(),
  status: z.enum(['Present', 'Absent']),
  latitude: z.number(),
  longitude: z.number(),
});

const markAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = createAttendanceSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    // Check if the session exists or session is active
    const session = await Sessions.findById(result?.data?.sessionId);

    // check if the student is already marked attendance for the session amd only student can mark attendance
    const attendance = await Attendance.findOne({
      sessionId: result?.data?.sessionId,
      studentId: (req as AuthRequest).userId,
    });

    if (attendance) {
      return res.status(400).json({
        message: 'Attendance already marked for this session',
      });
    }

    if (!session || !session.isActive) {
      return res.status(400).json({ message: 'Session not found or inactive' });
    }

    const organizationId = (req as AuthRequest).organizationId;
    // match lattiude and longitude from getOrganizationLocation comapre with payload latitude and longitude

    const getOrganizationLocation = await Organization.findById(organizationId);

    if (!getOrganizationLocation) {
      return res.status(400).json({
        message: 'Organization not found',
      });
    }
    console.log(getOrganizationLocation);

    if (
      getOrganizationLocation?.location?.latitude !== result.data.latitude ||
      getOrganizationLocation?.location?.longitude !== result.data.longitude
    ) {
      return res.status(400).json({
        message: 'You are not in the organization location',
      });
    }

    const studentId = (req as AuthRequest).userId;

    // Check if the student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Mark attendance create  in Attendance
    const newAttendance = await Attendance.create({
      ...result.data,
      studentId,
      lectureId: session.lectureId,
    });

    return res.status(201).json({
      Success: true,
      message: 'Attendance marked successfully',
      newAttendance,
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while marking attendance',
    });
  }
};

// get attendance by each session

const getAttendanceBySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Find the session and populate the lecture details

    const session = await Sessions.findById(sessionId)
      .populate({
        path: 'lectureId',
      })
      .populate({
        path: 'teacherId',
        select: '-password', // Exclude password field
      });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    // Find all attendance records for the given session
    const attendance = await Attendance.find({ sessionId });

    if (!attendance || attendance.length === 0) {
      return res
        .status(404)
        .json({ message: 'No attendance records found for this session.' });
    }

    // Extract the student IDs from the attendance records
    const studentsIds = attendance.map((att) => att.studentId);

    // Find the students whose IDs are in the attendance records
    const students = (await User.find({
      _id: { $in: studentsIds },
    })) as IUser[];

    // Combine attendance records with corresponding student details
    const attendanceWithStudentDetails = attendance.map((att) => {
      const student = students.find(
        (stu: IUser) => stu._id.toString() === att.studentId.toString()
      );
      return {
        student: student
          ? {
              id: student?._id,
              firstName: student?.firstName,
              lastName: student?.lastName,
              email: student?.email,
              role: student?.role,
              profilePic: student?.profilePic,
              phoneNumber: student?.phoneNumber,
              organizationId: student?.organizationId,
            }
          : null,
        attendedLectures: att.attendedLectures,
        status: att.status,
        markedAt: att.markedAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        teacher: session.teacherId, // Teacher details from session
        lecture: session.lectureId, // Lecture details from session
        attendance: attendanceWithStudentDetails, // Attendance details with student info
      },
    });
  } catch (error) {
    console.error('Get attendance by session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
// Get Attendance by Lecture (including present/absent lists)
const getAttendanceByLecture = async (req: Request, res: Response) => {
  try {
    const { lectureId } = req.params;

    // Find the lecture
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found.' });
    }

    // Find all sessions linked to the lecture
    const sessions = await Sessions.find({ lectureId });

    if (!sessions || sessions.length === 0) {
      return res
        .status(404)
        .json({ message: 'No sessions found for this lecture.' });
    }

    // Find all attendance records linked to the sessions
    const sessionIds = sessions.map((session) => session._id);
    const attendanceRecords = await Attendance.find({
      sessionId: { $in: sessionIds },
    });

    // Get all student IDs who attended the sessions
    const presentStudentIds = attendanceRecords
      .filter((record) => record.status === 'present')
      .map((record) => record.studentId);

    // Get all students in the class and filter out absent students
    const allStudents = await User.find({
      role: 'student',
      organizationId: lecture.organizationId,
    });
    const absentStudents = allStudents.filter(
      (student) => !presentStudentIds.includes(student._id)
    );

    // Return report
    return res.status(200).json({
      success: true,
      data: {
        lecture,
        presentStudents: presentStudentIds, // List of students present
        absentStudents: absentStudents, // List of students absent
      },
    });
  } catch (error) {
    console.error('Get attendance by lecture error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { markAttendance, getAttendanceBySession, getAttendanceByLecture };
