"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../db/config");
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        message: err.message,
        errorStack: config_1.config.nodeEnv === 'dev' ? err.stack : '', // only for dev purpose
    });
};
exports.default = globalErrorHandler;
