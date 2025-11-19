import express from 'express';

import { AuthController } from '../controllers/auth/AuthController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateUserInput } from '../middlewares/validateUsers';
import { authValidation, forgotPasswordValidation, resetPasswordValidation } from '../middlewares/auth/authValidation';
import { confirmAccountValidation, resetTokenValidation } from '../middlewares/auth/tokenValidations';
import { getLimiter, postLimiter, tokenLimiter } from '../config/limiter';

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

authRouter.post('/reset-password/:token',
    postLimiter,
    resetPasswordValidation,
    handleInputErrors,
    AuthController.resetPassword
)

authRouter.get('/user',
    getLimiter,
    authValidation,
    handleInputErrors,
    AuthController.user
)
