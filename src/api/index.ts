import app from '../app';
import { config } from '../db/config';
import connectDb from '../db/db';

const startServer = async () => {
  // connect database
  await connectDb();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Listening on Port: http://localhost:${port}/`);
  });
};

startServer();
