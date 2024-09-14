import express, { Request, Response, NextFunction } from 'express';
import globalErrorHandler from './middleware/globalErrorHandler';
import userRouter from './routes/user';

const app = express();
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'welcome to routes' });
});

app.use('/api/users', userRouter);

app.use(globalErrorHandler);

export default app;
