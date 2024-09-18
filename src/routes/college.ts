import express from 'express';
import { createCollege } from '../controllers/college';
import auth, { authTeacher } from '../middleware/auth';

const collegeRouter = express.Router();

// Route to create a new college
collegeRouter.post('/create', auth, authTeacher, createCollege);

export default collegeRouter;
