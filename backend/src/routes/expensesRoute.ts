import express from "express";
import { ExpenseController } from "../controllers/earning/ExpenseController";
import { validateExpenseInput } from "../middlewares/earnings/earningExpenseValidation";
import { handleInputErrors } from "../middlewares/hadleInputErrors";
import { validateExpenseById, validateExpenseExists } from "../middlewares/earnings/earningExpenseValidation";
import { deleteLimiter, getLimiter, postLimiter } from "../config/limiter";
import { authValidation } from "../middlewares/auth/authValidation";

const expenseRouter = express.Router();

expenseRouter.param('expenseId', validateExpenseById)
expenseRouter.param('expenseId', validateExpenseExists)

expenseRouter.use(authValidation);

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
    ExpenseController.deleteExpense
);

export default expenseRouter;