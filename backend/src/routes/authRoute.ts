import express from 'express';

import { AuthController } from '../controllers/auth/AuthController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateUserById, validateUserExists, validateUserInput } from '../middlewares/validateUsers';
import { confirmAccountValidation } from '../middlewares/auth/authValidation';
import { tokenLimiter } from '../config/limiter';

export const authRouter = express.Router();

authRouter.param('userId', validateUserById)
authRouter.param('userId', validateUserExists)

authRouter.post('',
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
    validateUserExists,
    handleInputErrors,
    AuthController.loginUser
)

