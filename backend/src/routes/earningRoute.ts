import express from 'express';
import { EarningController } from '../controllers/earning/EarningController';
import { earningPeriodValidation, earningValidation } from '../middlewares/earnings/earningValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { getLimiter, postLimiter } from '../config/limiter';
import { handleInputErrors } from '../middlewares/hadleInputErrors';

export const earningRouter = express.Router();

earningRouter.use(authValidation);

earningRouter.post('',
    postLimiter,
    earningValidation,
    earningPeriodValidation,
    handleInputErrors,
    EarningController.createEarning
)

earningRouter.get('',
    getLimiter,
    EarningController.getEarning
)

earningRouter.patch('/:earningId',
    postLimiter,
    earningValidation,
    earningPeriodValidation,
    handleInputErrors,
    EarningController.updateEarning
)