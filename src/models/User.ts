import mongoose from 'mongoose';

// Create schema for User
const userSchema = new mongoose.Schema(
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
      maxLength: 10,
    },
  },
  { timestamps: true }
); // Add createdAt, updatedAt automatically

// Export the model
const User = mongoose.model('User', userSchema);
export default User;
