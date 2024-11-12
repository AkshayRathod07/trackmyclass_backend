import express from 'express';
import { createLecture, getLecture } from '../controllers/lecture';
import auth from '../middleware/auth';
import { getAttendanceByLecture } from '../controllers/attendance';

const lectureRouter = express.Router();

lectureRouter.post('/create', auth, createLecture);
lectureRouter.get('/all', auth, getLecture);
lectureRouter.get(
  '/get-attendance-by-lecture/:lectureId',
  auth,
  getAttendanceByLecture
);

export default lectureRouter;
