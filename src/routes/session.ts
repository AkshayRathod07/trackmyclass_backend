import express from 'express';
import { CreateSession } from '../controllers/session';

const SessionRouter = express.Router();

SessionRouter.post('/create', CreateSession);

export default SessionRouter;
