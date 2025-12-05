import { Request, Response, NextFunction } from "express";
import { param, body } from "express-validator";

import Expense from "../../models/earning/EarningExpense";

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters')
        .run(req);
    
    await body('amount')
        .isDecimal({ decimal_digits: '0,2' }).withMessage('Amount must be a decimal number with up to 2 decimal places')
        .custom((value) => parseFloat(value) > 0).withMessage('Amount must be greater than 0')
        .run(req);

    // await body('description')
    //     .optional()
    //     .isString().withMessage('Description must be a string')
    //     .isLength({ max: 255 }).withMessage('Description can be up to 255 characters long')
    //     .run(req);
    next();
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
        const expense = await Expense.findOne({
            where: { 
                id: expenseId,
                userId: req.user.id,
                earningId: req.earning.id
            }
        })
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' })
        }
        req.expense = expense   
        next()
    } catch (error) {
        const err = new Error('Failed to get expense by id')
        res.status(500).json({ message: err.message })
    }
}