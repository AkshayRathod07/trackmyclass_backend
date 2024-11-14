import express from 'express';
import {
  CreateSession,
  deleteSession,
  getAllSessions,
} from '../controllers/session';
import auth from '../middleware/auth';

const SessionRouter = express.Router();

SessionRouter.post('/create', auth, CreateSession);
// getAllSessions route
SessionRouter.get('/all', auth, getAllSessions);

// deleteSession route
SessionRouter.delete('/delete/:sessionId', auth, deleteSession);

export default SessionRouter;
