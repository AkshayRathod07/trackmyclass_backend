import express from 'express';
import { signup, signIn, inviteUser, verifyCode } from '../controllers/user';
import auth from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/signUp', signup);
userRouter.post('/signIn', signIn);
userRouter.post('/invite', auth, inviteUser);
userRouter.post('/verify-invite', verifyCode);

export default userRouter;
