import express from 'express';
import {
  signup,
  signIn,
  inviteUser,
  verifyCode,
  getMyProfile,
} from '../controllers/user';
import auth from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/signUp', signup);
userRouter.post('/signIn', signIn);
userRouter.post('/invite', auth, inviteUser);
userRouter.post('/verify-invite', verifyCode);
userRouter.get('/get-my-profile', auth, getMyProfile);

export default userRouter;
