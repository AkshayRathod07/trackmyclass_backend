import express from 'express';
import auth from '../middleware/auth';
import {
  getAllDatesAnalytics,
  getDailyAnalytics,
  getWeeklyAnalytics,
} from '../controllers/analytics';

const analyticsRouter = express.Router();

analyticsRouter.get('/daily-analytics', auth, getDailyAnalytics);
analyticsRouter.get('/weekly-analytics', auth, getWeeklyAnalytics);
analyticsRouter.get('/all-analytics', auth, getAllDatesAnalytics);

export default analyticsRouter;
