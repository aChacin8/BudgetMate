import express from 'express';

import { AuthController } from '../controllers/auth/AuthController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateUserInput } from '../middlewares/validateUsers';
import { forgotPasswordValidation } from '../middlewares/auth/authValidation';
import { confirmAccountValidation, resetTokenValidation } from '../middlewares/auth/tokenValidations';
import { postLimiter, tokenLimiter } from '../config/limiter';

export const authRouter = express.Router();

authRouter.post('',
    postLimiter,
    validateUserInput,
    handleInputErrors,
    AuthController.createUser
)

authRouter.post('/confirm-account', 
    tokenLimiter,
    confirmAccountValidation,
    handleInputErrors,
    AuthController.confirmAccount
)

authRouter.post('/login', 
    postLimiter,
    handleInputErrors,
    AuthController.loginUser
)

authRouter.post('/forgot-password',
    postLimiter,
    forgotPasswordValidation,
    handleInputErrors,
    AuthController.forgotPassword
)

authRouter.post('/reset-password',
    tokenLimiter,
    resetTokenValidation,
)

