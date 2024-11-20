"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const attendance_enum_1 = require("../enum/attendance.enum");
// Create schema for Attendance
const attendanceSchema = new mongoose_1.default.Schema({
    sessionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Session', // Reference to the Session
    },
    studentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User (student)
    },
    organizedId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Organization', // Reference to the Organization
    },
    attendedLectures: {
        type: Number,
        required: true,
        default: 1,
    },
    status: {
        type: String,
        enum: attendance_enum_1.attendanceStatus,
        default: attendance_enum_1.attendanceStatus.absent,
    },
    markedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, { timestamps: true });
const Attendance = mongoose_1.default.model('Attendance', attendanceSchema);
exports.default = Attendance;
