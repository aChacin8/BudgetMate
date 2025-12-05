import express from 'express';
import { EarningController } from '../controllers/earning/EarningController';
import { validateEarningExists, validateEarningInput } from '../middlewares/earnings/earningValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { deleteLimiter, getLimiter, postLimiter } from '../config/limiter';
import { handleInputErrors } from '../middlewares/hadleInputErrors';

export const earningRouter = express.Router();

earningRouter.use(authValidation);
earningRouter.param('earningId', validateEarningExists);

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

earningRouter.get('/:earningId', 
    getLimiter,
    handleInputErrors,
    EarningController.getEarningById
)

earningRouter.patch('/:earningId',
    postLimiter,
    validateEarningInput,
    handleInputErrors,
    EarningController.updateEarning
)

earningRouter.delete('/:earningId',
    deleteLimiter,
    handleInputErrors,
    EarningController.deleteEarning
)

