import express from 'express';
import {
  getAttendanceBySession,
  markAttendance,
} from '../controllers/attendance';
import auth from '../middleware/auth';

const AttendanceRouter = express.Router();

AttendanceRouter.post('/mark-my-attendance', auth, markAttendance);
AttendanceRouter.get('/by-session/:sessionId', auth, getAttendanceBySession);

export default AttendanceRouter;
