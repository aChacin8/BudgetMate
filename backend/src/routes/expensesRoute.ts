import express from "express";
import { ExpenseController } from "../controllers/earning/ExpenseController";
import { validateExpenseInput } from "../middlewares/budget/budgetExpenseValidation";
import { handleInputErrors } from "../middlewares/hadleInputErrors";
import { validateExpenseById, validateExpenseExists } from "../middlewares/earnings/expenseValidation";
import { deleteLimiter, getLimiter, postLimiter } from "../config/limiter";

const expenseRouter = express.Router();

expenseRouter.param('expenseId', validateExpenseById)
expenseRouter.param('expenseId', validateExpenseExists)

expenseRouter.post('',
    postLimiter,
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.createExpense
);

expenseRouter.get('', getLimiter, ExpenseController.getExpenses);

expenseRouter.get('/:expenseId',
    getLimiter,
    handleInputErrors,
    ExpenseController.getExpenseById);

expenseRouter.patch('/:expenseId',
    postLimiter,
    validateExpenseInput,
    handleInputErrors,
    ExpenseController.updateExpense
);

expenseRouter.delete('/:expenseId',
    deleteLimiter,
    handleInputErrors, 
    ExpenseController.deleteExpense)

export default expenseRouter;