import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Session
interface ISession extends Document {
  teacherId: mongoose.Schema.Types.ObjectId;
  subject: string;
  date: Date;
  totalLectures: number; // Number of lectures for the session day
}

// Create schema for Sessions
const sessionSchema: Schema<ISession> = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User (admin/teacher)
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalLectures: {
      type: Number,
      required: true,
      default: 1, // Usually 1 session, but could be multiple
    },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>('Session', sessionSchema);
export default Session;
