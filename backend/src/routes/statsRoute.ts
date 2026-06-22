import express from 'express';
import { StatisticsController } from '../controllers/stats/StatisticsController';
import { authValidation } from '../middlewares/auth/authValidation';
import { getLimiter } from '../config/limiter';

const statsRouter = express.Router();

statsRouter.use(authValidation);

statsRouter.get('/monthly-trend', getLimiter, StatisticsController.getMonthlyTrend);
statsRouter.get('/expenses-breakdown', getLimiter, StatisticsController.getExpensesBreakdown);
statsRouter.get('/overview', getLimiter, StatisticsController.getOverview);

export default statsRouter;
