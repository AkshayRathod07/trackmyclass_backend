import express from 'express';
import { signup, signIn } from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/signIn', signIn);

export default userRouter;
