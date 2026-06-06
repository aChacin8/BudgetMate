import express from 'express';
import { FinancialSummaryController } from '../controllers/summary/FinancialSummaryController';
import { authValidation } from '../middlewares/auth/authValidation';
import { getLimiter, postLimiter } from '../config/limiter';

const summaryRouter = express.Router();

summaryRouter.use(authValidation);

summaryRouter.get('', getLimiter, FinancialSummaryController.getSummaryHistory);
summaryRouter.get('/current', getLimiter, FinancialSummaryController.getSummary);
summaryRouter.post('/compute', postLimiter, FinancialSummaryController.computeAndSave);

export default summaryRouter;
