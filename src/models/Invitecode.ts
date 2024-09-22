import mongoose, { Schema, Document } from 'mongoose';

// Define the Code interface
export interface ICode extends Document {
  code: string;
  email: string;
  role: string;
  invitedBy?: mongoose.Schema.Types.ObjectId;
  organizationId: mongoose.Schema.Types.ObjectId;
  organizationName: string;
}

// Create schema for Code
const codeSchema: Schema<ICode> = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['STUDENT', 'TEACHER'],
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  organizationName: {
    type: String,
  },
});

export default mongoose.model<ICode>('InviteCode', codeSchema);
