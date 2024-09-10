import mongoose, { Schema, Document } from 'mongoose';

// Interface for the User
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'superAdmin';
  profilePic?: string;
  phoneNumber: string;
  sessions: mongoose.Schema.Types.ObjectId[]; // List of session references
  attendance: mongoose.Schema.Types.ObjectId[]; // List of attendance records
}

// Create schema for User
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxLength: 20,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxLength: 20,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Normalize email to lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'superAdmin'], // Restrict role to allowed values
      default: 'student', // Set default role as 'student'
    },
    profilePic: {
      type: String, // Optional profile picture URL
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      maxlength: 10,
      validate: {
        validator: function (v: string) {
          return /^[0-9]{10}$/.test(v); // Simple validation for 10 digits
        },
        message: 'Phone number must be 10 digits.',
      },
    },
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session', // Reference to Session model
      },
    ],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance', // Reference to Attendance model
      },
    ],
  },
  { timestamps: true } // Add createdAt, updatedAt automatically
);

// Export the model
const User = mongoose.model<IUser>('User', userSchema);
export default User;
