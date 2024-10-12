import express from 'express';
import { createLecture } from '../controllers/lecture';
import auth from '../middleware/auth';

const lectureRouter = express.Router();

lectureRouter.post('/create', auth, createLecture);

export default lectureRouter;
