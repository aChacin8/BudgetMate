import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";


export const earningValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body('baseAmount')
        .notEmpty().withMessage('Base amount is required')
        .isNumeric().withMessage('Base amount must be a number')
        .custom((value) => value > 0).withMessage('Base amount must be greater than 0')
        .run(req);
    await body('userId')
        .notEmpty().withMessage('User ID is required')
        .isInt().withMessage('User ID must be an integer')
        .custom((value) => value > 0).withMessage('User ID must be greater than 0')
        .run(req);
    next();
}

