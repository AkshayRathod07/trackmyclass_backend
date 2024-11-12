"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lecture_1 = require("../controllers/lecture");
const auth_1 = __importDefault(require("../middleware/auth"));
const attendance_1 = require("../controllers/attendance");
const lectureRouter = express_1.default.Router();
lectureRouter.post('/create', auth_1.default, lecture_1.createLecture);
lectureRouter.get('/get-attendance-by-lecture/:lectureId', auth_1.default, attendance_1.getAttendanceByLecture);
exports.default = lectureRouter;
