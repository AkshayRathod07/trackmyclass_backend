import express from 'express';
import { CreateSession } from '../controllers/session';
import auth from '../middleware/auth';

const SessionRouter = express.Router();

SessionRouter.post('/create', auth, CreateSession);

export default SessionRouter;
