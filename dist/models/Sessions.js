"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Create schema for Sessions
const sessionSchema = new mongoose_1.default.Schema({
    teacherId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User (admin/teacher)
    },
    lectureId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Lecture', // Reference to the Lecture
    },
    organizationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Organization', // Reference to the Organization
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
}, { timestamps: true });
const Session = mongoose_1.default.model('Session', sessionSchema);
exports.default = Session;
