import express from 'express';
import './db/config';
import routes from './routes';
import { Request, Response } from 'express';
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/', routes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
