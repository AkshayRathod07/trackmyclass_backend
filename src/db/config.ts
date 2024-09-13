import mongoose from 'mongoose';

import 'dotenv/config';

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_ATLAS_CONNECTION,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
