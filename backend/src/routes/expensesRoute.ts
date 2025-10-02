import express  from "express";
import { ExpenseController } from "../controllers/ExpenseController";
import { validateExpenseInput } from "../middlewares/validateBudgetExpense";
import { handleInputErrors } from "../middlewares/hadleInputErrors";
import { validateExpenseById, validateExpenseExists } from "../middlewares/validateExpense";

const expenseRouter = express.Router();

expenseRouter.param('expenseId', validateExpenseById)
expenseRouter.param('expenseId', validateExpenseExists)

expenseRouter.post('', 
                validateExpenseInput, 
                handleInputErrors, 
                ExpenseController.createExpense
            );

expenseRouter.get('', ExpenseController.getExpenses);

expenseRouter.get('/:expenseId', handleInputErrors, ExpenseController.getExpenseById);

expenseRouter.patch('/:expenseId', 
                validateExpenseInput,
                handleInputErrors,
                ExpenseController.updateExpense
            );

expenseRouter.delete('/:expenseId', handleInputErrors, ExpenseController.deleteExpense)

export default expenseRouter;