"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const lectureSchema = new mongoose_1.default.Schema({
    subject: {
        type: String,
        required: true,
    },
    teacherId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User (admin/teacher)
    },
    organizationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
const Lecture = mongoose_1.default.model('Lecture', lectureSchema);
exports.default = Lecture;
