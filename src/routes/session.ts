import express from 'express';
import { CreateSession, getAllSessions } from '../controllers/session';
import auth from '../middleware/auth';

const SessionRouter = express.Router();

SessionRouter.post('/create', auth, CreateSession);
// getAllSessions route
SessionRouter.get('/all', auth, getAllSessions);

export default SessionRouter;
