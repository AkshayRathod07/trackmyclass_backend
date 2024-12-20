"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceByLecture = exports.getAttendanceBySession = exports.markAttendance = void 0;
const zod_1 = require("zod");
const User_1 = __importDefault(require("../models/User"));
const Sessions_1 = __importDefault(require("../models/Sessions"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Lecture_1 = __importDefault(require("../models/Lecture"));
const Organization_1 = __importDefault(require("../models/Organization"));
const createAttendanceSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    attendedLectures: zod_1.z.number(),
    status: zod_1.z.enum(['Present', 'Absent']),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
});
// Function to calculate the distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180; // Convert latitude to radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
};
const markAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
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
        const session = yield Sessions_1.default.findById((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.sessionId);
        // check if the student is already marked attendance for the session amd only student can mark attendance
        const attendance = yield Attendance_1.default.findOne({
            sessionId: (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.sessionId,
            studentId: req.userId,
        });
        if (attendance) {
            return res.status(400).json({
                message: 'Attendance already marked for this session',
            });
        }
        if (!session || !session.isActive) {
            return res.status(400).json({ message: 'Session not found or inactive' });
        }
        const organizationId = req.organizationId;
        // match lattiude and longitude from getOrganizationLocation comapre with payload latitude and longitude
        const getOrganizationLocation = yield Organization_1.default.findById(organizationId);
        if (!getOrganizationLocation) {
            return res.status(400).json({
                message: 'Organization not found',
            });
        }
        console.log(getOrganizationLocation);
        // Calculate distance
        const distance = calculateDistance((_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.latitude, (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.longitude, (_e = getOrganizationLocation === null || getOrganizationLocation === void 0 ? void 0 : getOrganizationLocation.location) === null || _e === void 0 ? void 0 : _e.latitude, (_f = getOrganizationLocation === null || getOrganizationLocation === void 0 ? void 0 : getOrganizationLocation.location) === null || _f === void 0 ? void 0 : _f.longitude);
        if (distance <= 50) {
            // Mark attendance logic here
            const studentId = req.userId;
            // Check if the student exists
            const student = yield User_1.default.findById(studentId);
            if (!student) {
                return res.status(400).json({ message: 'Student not found' });
            }
            // Mark attendance create  in Attendance
            const newAttendance = yield Attendance_1.default.create(Object.assign(Object.assign({}, result.data), { studentId, lectureId: session.lectureId }));
            return res.status(201).json({
                Success: true,
                message: 'Attendance marked successfully',
                newAttendance,
            });
        }
        else {
            return res.status(403).json({
                message: 'You are outside the allowed radius to mark attendance',
            });
        }
        // if (
        //   getOrganizationLocation?.location?.latitude !== result.data.latitude ||
        //   getOrganizationLocation?.location?.longitude !== result.data.longitude
        // ) {
        //   return res.status(400).json({
        //     message: 'You are not in the organization location',
        //   });
        // }
    }
    catch (error) {
        console.error('Create attendance error:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while marking attendance',
        });
    }
});
exports.markAttendance = markAttendance;
// get attendance by each session
const getAttendanceBySession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        // Find the session and populate the lecture details
        const session = yield Sessions_1.default.findById(sessionId)
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
        const attendance = yield Attendance_1.default.find({ sessionId });
        if (!attendance || attendance.length === 0) {
            return res
                .status(404)
                .json({ message: 'No attendance records found for this session.' });
        }
        // Extract the student IDs from the attendance records
        const studentsIds = attendance.map((att) => att.studentId);
        // Find the students whose IDs are in the attendance records
        const students = (yield User_1.default.find({
            _id: { $in: studentsIds },
        }));
        // Combine attendance records with corresponding student details
        const attendanceWithStudentDetails = attendance.map((att) => {
            const student = students.find((stu) => stu._id.toString() === att.studentId.toString());
            return {
                student: student
                    ? {
                        id: student === null || student === void 0 ? void 0 : student._id,
                        firstName: student === null || student === void 0 ? void 0 : student.firstName,
                        lastName: student === null || student === void 0 ? void 0 : student.lastName,
                        email: student === null || student === void 0 ? void 0 : student.email,
                        role: student === null || student === void 0 ? void 0 : student.role,
                        profilePic: student === null || student === void 0 ? void 0 : student.profilePic,
                        phoneNumber: student === null || student === void 0 ? void 0 : student.phoneNumber,
                        organizationId: student === null || student === void 0 ? void 0 : student.organizationId,
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
    }
    catch (error) {
        console.error('Get attendance by session error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAttendanceBySession = getAttendanceBySession;
// Get Attendance by Lecture (including present/absent lists)
const getAttendanceByLecture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lectureId } = req.params;
        // Find the lecture
        const lecture = yield Lecture_1.default.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found.' });
        }
        // Find all sessions linked to the lecture
        const sessions = yield Sessions_1.default.find({ lectureId });
        if (!sessions || sessions.length === 0) {
            return res
                .status(404)
                .json({ message: 'No sessions found for this lecture.' });
        }
        // Find all attendance records linked to the sessions
        const sessionIds = sessions.map((session) => session._id);
        const attendanceRecords = yield Attendance_1.default.find({
            sessionId: { $in: sessionIds },
        });
        // Get all student IDs who attended the sessions
        const presentStudentIds = attendanceRecords
            .filter((record) => record.status === 'Present')
            .map((record) => record.studentId);
        // Get all students in the class and filter out absent students
        const allStudents = yield User_1.default.find({
            role: 'student',
            organizationId: lecture.organizationId,
        });
        const absentStudents = allStudents.filter((student) => !presentStudentIds.includes(student._id));
        // Return report
        return res.status(200).json({
            success: true,
            data: {
                lecture,
                presentStudents: presentStudentIds, // List of students present
                absentStudents: absentStudents, // List of students absent
            },
        });
    }
    catch (error) {
        console.error('Get attendance by lecture error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAttendanceByLecture = getAttendanceByLecture;
