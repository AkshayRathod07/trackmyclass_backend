import express from 'express';
import { markAttendance } from '../controllers/attendance';
import auth from '../middleware/auth';

const AttendanceRouter = express.Router();

AttendanceRouter.post('/mark-my-attendance', auth, markAttendance);

export default AttendanceRouter;
