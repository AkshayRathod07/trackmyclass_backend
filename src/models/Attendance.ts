import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Attendance
interface IAttendance extends Document {
  sessionId: mongoose.Schema.Types.ObjectId;
  studentId: mongoose.Schema.Types.ObjectId;
  attendedLectures: number; // Number of lectures the student attended for the session
  markedAt: Date;
}

// Create schema for Attendance
const attendanceSchema: Schema<IAttendance> = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session', // Reference to the session
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the student (User model with role 'student')
      required: true,
    },
    attendedLectures: {
      type: Number,
      required: true,
      default: 1, // The student attended at least one lecture
    },
    markedAt: {
      type: Date,
      default: Date.now, // Timestamp of when attendance was marked
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;
