"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_1 = require("../enum/user.enum");
// Create schema for User
const userSchema = new mongoose_1.default.Schema({
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
        enum: user_enum_1.role,
        default: user_enum_1.userRole.STUDENT,
    },
    organizationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Organization',
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
            validator: function (v) {
                return /^[0-9]{10}$/.test(v); // Simple validation for 10 digits
            },
            message: 'Phone number must be 10 digits.',
        },
    },
    sessions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Session', // Reference to Session model
        },
    ],
    attendance: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Attendance', // Reference to Attendance model
        },
    ],
    invitedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true } // Add createdAt, updatedAt automatically
);
// Export the model
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
