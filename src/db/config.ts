import 'dotenv/config';

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_ATLAS_CONNECTION,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  frontEndDomain: process.env.FRONT_END_DOMAIN,
};

export const config = Object.freeze(_config);
