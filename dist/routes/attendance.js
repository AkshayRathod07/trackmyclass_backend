"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendance_1 = require("../controllers/attendance");
const auth_1 = __importDefault(require("../middleware/auth"));
const AttendanceRouter = express_1.default.Router();
AttendanceRouter.post('/mark-my-attendance', auth_1.default, attendance_1.markAttendance);
AttendanceRouter.get('/by-session/:sessionId', auth_1.default, attendance_1.getAttendanceBySession);
exports.default = AttendanceRouter;
