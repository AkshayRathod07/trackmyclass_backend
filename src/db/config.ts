import mongoose from 'mongoose';

import 'dotenv/config';

const db = process.env.MONGO_URI;
if (!db) {
  throw new Error('You must provide a string to connect to MongoDB Atlas');
}

mongoose
  .connect(db)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error:', error);
  });
