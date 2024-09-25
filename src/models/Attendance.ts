import mongoose, { Schema, Document } from 'mongoose';
import { attendanceStatus, Astatus } from '../enum/attendance.enum';

// Interface for the Attendance
interface IAttendance extends Document {
  sessionId: mongoose.Schema.Types.ObjectId;
  studentId: mongoose.Schema.Types.ObjectId;
  attendedLectures: number; // Number of lectures the student attended for the session
  status: attendanceStatus;
  markedAt: Date;
}

// Create schema for Attendance
const attendanceSchema: Schema<IAttendance> = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session', // Reference to the Session
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User (student)
    },
    attendedLectures: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: attendanceStatus,
      default: attendanceStatus.Absent,
    },
    markedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;
