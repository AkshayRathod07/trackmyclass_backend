import express, { Request, Response } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './routes/user';
import collegeRouter from './routes/college';
import cors from 'cors';
import { config } from './db/config';

const app = express();

app.use(
  cors({
    origin: config.frontEndDomain,
  })
);

app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'welcome to routes' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/college', collegeRouter);

app.use(globalErrorHandler);

export default app;

// Writing this for testing purpose of commit
