import { Request, Response, NextFunction } from "express";
import { param, body } from "express-validator";

import Expense from "../../models/earning/EarningExpense";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseById = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId')
        .isInt().withMessage('Invalid ID')
        .custom((value) => value > 0).withMessage('ID must be greater than 0')
        .run(req)

    next();
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId)
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' })
        }
        req.expense = expense   
        next()
    } catch (error) {
        const err = new Error('Failed to get expense by id')
        res.status(500).json({ message: err.message })
    }

    next();
}