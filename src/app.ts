import express, { Request, Response, NextFunction } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './routes/user';
import collegeRouter from './routes/college';

const app = express();
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'welcome to routes' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/college', collegeRouter);

app.use(globalErrorHandler);

export default app;