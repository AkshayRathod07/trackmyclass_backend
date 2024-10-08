import express from 'express';
import { markAttendance } from '../controllers/attendance';

const AttendanceRouter = express.Router();

AttendanceRouter.post('/mark-my-attendance', markAttendance);

export default AttendanceRouter;
