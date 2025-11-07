import express from 'express';

import { AuthController } from '../controllers/auth/AuthController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateUserById, validateUserExists, validateUserInput } from '../middlewares/validateUsers';
import { confirmAccountValidation } from '../middlewares/auth/authValidation';
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

