"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_1 = require("../controllers/session");
const auth_1 = __importDefault(require("../middleware/auth"));
const SessionRouter = express_1.default.Router();
SessionRouter.post('/create', auth_1.default, session_1.CreateSession);
// getAllSessions route
SessionRouter.get('/all', auth_1.default, session_1.getAllSessions);
// deleteSession route
SessionRouter.delete('/delete/:sessionId', auth_1.default, session_1.deleteSession);
exports.default = SessionRouter;
