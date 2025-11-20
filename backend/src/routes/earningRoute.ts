import express from 'express';
import { EarningController } from '../controllers/earning/EarningController';
import { earningValidation } from '../middlewares/earnings/earningValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { getLimiter, postLimiter } from '../config/limiter';

export const earningRouter = express.Router();

earningRouter.use(authValidation);

earningRouter.post('',
    postLimiter,
    earningValidation,
    EarningController.createEarning
)

earningRouter.get('',
    getLimiter,
    EarningController.getEarning
)