import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import Sessions from '../models/Sessions';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../middleware/auth';

const createAttendanceSchema = z.object({
  sessionId: z.string(),
  attendedLectures: z.number(),
  status: z.enum(['Present', 'Absent']),
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
    if (!session || !session.isActive) {
      return res.status(400).json({ message: 'Session not found or inactive' });
    }

    const studentId = (req as AuthRequest).userId;

    console.log('studentIds', studentId);

    // Check if the student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    // Mark attendance create  in Attendance
    const newAttendance = await Attendance.create({
      ...result.data,
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

export { markAttendance };
