import express, { Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './routes/user';
import collegeRouter from './routes/college';

import lectureRouter from './routes/lecture';
import SessionRouter from './routes/session';
import AttendanceRouter from './routes/attendance';
import adminRouter from './routes/admin';

import cors from 'cors';
import { config } from './db/config';
import analyticsRouter from './routes/analytics';

const app = express();

app.use(
  cors({
    origin: config.frontEndDomain,
  })
);

app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Project is working');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/college', collegeRouter);

app.use('/api/v1/lecture', lectureRouter);
app.use('/api/v1/session', SessionRouter);
app.use('/api/v1/attendance', AttendanceRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/analytics', analyticsRouter);

app.use(globalErrorHandler);

export default app;

// Writing this for testing purpose of commit
