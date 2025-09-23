import { Request, Response, NextFunction } from "express";
import { param, body } from "express-validator";

export const validateBudget = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
            .notEmpty().withMessage('Name is required')
            .run(req);
    await body('amount')
            .notEmpty().withMessage('Amount is required')
            .isNumeric().withMessage('Amount must be a number')
            .custom((value) => value > 0).withMessage('Amount must be greater than 0')
            .run(req)

    next();
}

export const validateBudgetById = async (req: Request, res: Response, next: NextFunction) => {
    await param('id')
                        .isInt().withMessage('Invalid ID')
                        .custom((value) => value > 0).withMessage('ID must be greater than 0')
                        .run(req)
    
    next();
}