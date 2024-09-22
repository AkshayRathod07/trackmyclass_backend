import express from 'express';
import { signup, signIn, inviteUser } from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/signUp', signup);
userRouter.post('/signIn', signIn);
userRouter.post('/invite', inviteUser);

export default userRouter;
