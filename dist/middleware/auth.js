"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authTeacher = void 0;
const config_1 = require("../db/config");
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = require("jsonwebtoken");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('Authorization');
    if (!token) {
        return next((0, http_errors_1.default)(401, 'Auth Token Required'));
    }
    try {
        const parsedToken = token.split(' ')[1];
        const decoded = (0, jsonwebtoken_1.verify)(parsedToken, config_1.config.jwtSecret);
        // check if organizationId exists
        if (!decoded.organizationId) {
            return next((0, http_errors_1.default)(400, 'Organization ID not found in the token'));
        }
        const _req = req;
        _req.userId = decoded.sub;
        _req.role = decoded.role;
        _req.organizationId = decoded.organizationId;
        next();
    }
    catch (error) {
        return next((0, http_errors_1.default)(401, 'Token Expired or Invalid'));
    }
});
const authTeacher = (req, res, next) => {
    if (req.role !== 'admin') {
        console.log(req.role);
        return next((0, http_errors_1.default)(403, 'Access Forbidden: Teacher role required'));
    }
    next();
};
exports.authTeacher = authTeacher;
exports.default = auth;
