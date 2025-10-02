import { Request, Response, NextFunction } from "express";
import { param, body } from "express-validator";

import BudgetExpense from "../../models/budget/BudgetExpense";

declare global {
    namespace Express {
        interface Request {
            budgetExpense?: BudgetExpense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty().withMessage('Name is required')
        .run(req)
    await body('amount')
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number')
        .custom((value) => value > 0).withMessage('Amount must be greater than 0')
        .run(req)

    next();
}

export const validateBudgetExpenseById = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetExpenseId')
        .isInt().withMessage('Invalid ID')
        .custom((value) => value > 0).withMessage('ID must be greater than 0')
        .run(req)

    next();
}

export const validateBudgetExpenseExists = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const { budgetExpenseId, budgetId } = req.params;

        const budgetExpense = await BudgetExpense.findOne({
            where: {
                id: budgetExpenseId,
                budgetId: budgetId
            }
        });

        if (!budgetExpense) {
            return res.status(404).json({ message: 'Expense not found for this budget' });
        }

        req.budgetExpense = budgetExpense;
        next();
    } catch (error) {
        const err = new Error('Failed to get expense by id');
        res.status(500).json({ message: err.message });
    }
};


