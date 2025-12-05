import express from 'express';

import { AuthController } from '../controllers/auth/AuthController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateUserInput } from '../middlewares/auth/usersValidations';
import { authValidation} from '../middlewares/auth/authValidation';
import { checkPasswordValidation, forgotPasswordValidation, resetPasswordValidation, updatePasswordValidation } from '../middlewares/auth/passwordValidation'
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

authRouter.get('/user',
    getLimiter,
    authValidation,
    handleInputErrors,
    AuthController.user
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

authRouter.post('/update-password',
    postLimiter,
    authValidation,
    updatePasswordValidation,
    handleInputErrors,
    AuthController.updatePassword
)

authRouter.post('/check-password',
    postLimiter,
    authValidation,
    checkPasswordValidation,
    handleInputErrors,
    AuthController.checkPassword
)