import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';

export const confirmAccountValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body('token')
        .notEmpty().withMessage('Token is required')
        .isInt().withMessage('Token must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 characters long')
        .run(req)

    next();
}

export const resetTokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body ('token')
        .notEmpty().withMessage('Token is required')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 characters long')
        .run(req)
    
    next();
}
