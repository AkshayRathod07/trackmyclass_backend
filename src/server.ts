import express from 'express';
import './db/config';
import routes from './routes';

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/', routes);

app.get('/', (req: Request, res: any) => {
  res.send('Hello World from Express and TypeScript');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
