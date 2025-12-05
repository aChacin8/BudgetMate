import { Request, Response, NextFunction } from "express";
import { param } from "express-validator";

import BudgetExpense from "../../models/budget/BudgetExpense";

export const validateBudgetExpenseById = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetExpenseId')
        .isInt().withMessage('Invalid ID')
        .custom((value) => value > 0).withMessage('ID must be greater than 0')
        .run(req)

    next();
}

export const validateBudgetExpenseExists = async (req: Request,res: Response,next: NextFunction) => {
    try {
        const { budgetExpenseId } = req.params;

        const budgetExpense = await BudgetExpense.findOne({
            where: {
                id: budgetExpenseId,
                budgetId: req.budget.id,
                userId: req.user.id
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


