"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = __importDefault(require("../middleware/auth"));
const userRouter = express_1.default.Router();
userRouter.post('/signUp', user_1.signup);
userRouter.post('/signIn', user_1.signIn);
userRouter.post('/invite', auth_1.default, user_1.inviteUser);
userRouter.post('/verify-invite', user_1.verifyCode);
userRouter.get('/get-my-profile', auth_1.default, user_1.getMyProfile);
exports.default = userRouter;
