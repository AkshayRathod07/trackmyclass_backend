"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv/config");
const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_ATLAS_CONNECTION,
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    frontEndDomain: process.env.FRONT_END_DOMAIN,
};
exports.config = Object.freeze(_config);
