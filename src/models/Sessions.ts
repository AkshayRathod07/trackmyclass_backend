import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Session
interface ISession extends Document {
  teacherId: mongoose.Schema.Types.ObjectId;
  lectureId: mongoose.Schema.Types.ObjectId;
  startTime: Date;

  isActive: boolean;
}

// Create schema for Sessions
const sessionSchema: Schema<ISession> = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User (admin/teacher)
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture', // Reference to the Lecture
    },
    startTime: {
      type: Date,
      required: false,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>('Session', sessionSchema);
export default Session;
