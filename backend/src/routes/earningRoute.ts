import express from 'express';
import { EarningController } from '../controllers/earning/EarningController';
import { validateEarning, validateEarningInput } from '../middlewares/earnings/earningValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { getLimiter, postLimiter } from '../config/limiter';
import { handleInputErrors } from '../middlewares/hadleInputErrors';

export const earningRouter = express.Router();

earningRouter.use(authValidation);

earningRouter.post('',
    postLimiter,
    validateEarningInput,
    handleInputErrors,
    EarningController.createEarning
)

earningRouter.get('',
    getLimiter,
    EarningController.getEarnings
)

earningRouter.patch('/:earningId',
    postLimiter,
    validateEarningInput,
    validateEarning,
    handleInputErrors,
    EarningController.updateEarning
)