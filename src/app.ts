import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'welcome to routes' });
});

export default app;
