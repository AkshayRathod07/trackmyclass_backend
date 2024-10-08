import express from 'express';
import { createLecture } from '../controllers/lecture';

const lectureRouter = express.Router();

lectureRouter.post('/create', createLecture);

export default lectureRouter;
