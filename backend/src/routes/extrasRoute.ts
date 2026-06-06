import express from 'express';
import { ExtraController } from '../controllers/earning/ExtraController';
import { validateExtraInput, validateExtraEarningById, validateExtraEarningExists } from '../middlewares/earnings/earningExtraValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { deleteLimiter, getLimiter, postLimiter } from '../config/limiter';
import { validateEarningExists } from '../middlewares/earnings/earningValidation';

const extrasRouter = express.Router({ mergeParams: true });

extrasRouter.use(authValidation);
extrasRouter.use(validateEarningExists);
extrasRouter.param('extraEarningId', validateExtraEarningById);
extrasRouter.param('extraEarningId', validateExtraEarningExists);

extrasRouter.post('',
    postLimiter,
    validateExtraInput,
    handleInputErrors,
    ExtraController.createExtra
);

extrasRouter.get('', getLimiter, ExtraController.getExtras);

extrasRouter.get('/:extraEarningId',
    getLimiter,
    handleInputErrors,
    ExtraController.getExtraById
);

extrasRouter.patch('/:extraEarningId',
    postLimiter,
    validateExtraInput,
    handleInputErrors,
    ExtraController.updateExtra
);

extrasRouter.delete('/:extraEarningId',
    deleteLimiter,
    handleInputErrors,
    ExtraController.deleteExtra
);

export default extrasRouter;
