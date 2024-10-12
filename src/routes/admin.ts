import express from 'express';
import auth from '../middleware/auth';
import { userByOrganization } from '../controllers/admin';

const adminRouter = express.Router();

adminRouter.get('/user-by-org', auth, userByOrganization);

export default adminRouter;
