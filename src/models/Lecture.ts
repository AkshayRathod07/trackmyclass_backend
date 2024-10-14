import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
  subject: string;
  teacherId: mongoose.Schema.Types.ObjectId;
  organizationId: mongoose.Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  dayOfWeek: string;
  duration: number;
}

const lectureSchema: Schema<ILecture> = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User (admin/teacher)
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
  },
  { timestamps: true }
);

const Lecture = mongoose.model<ILecture>('Lecture', lectureSchema);
export default Lecture;
