import express from 'express';

import { BudgetController } from '../controllers/BudgetsControllers';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudget, validateBudgetById, validateBudgetExists } from '../middlewares/validateBudget';
import { ExpenseController } from '../controllers/ExpenseController';

export const budgetRouter = express.Router();

budgetRouter.param('budgetId', validateBudgetById)
budgetRouter.param('budgetId', validateBudgetExists)

budgetRouter.post('', 
                validateBudget,
                handleInputErrors,
                BudgetController.createbudget
                );

budgetRouter.get('', BudgetController.getBudgets)

budgetRouter.get('/:budgetId',
                handleInputErrors,
                BudgetController.getBudgetById
            );

budgetRouter.patch('/:budgetId',
                validateBudget,
                handleInputErrors,
                BudgetController.updateBudget
            );

budgetRouter.delete('/:budgetId', BudgetController.deleteBudget);

budgetRouter.post('/:budgetId/expenses', ExpenseController.createExpense)
budgetRouter.get('/:budgetId/expenses/:expenseId', ExpenseController.getExpenseById)
budgetRouter.patch('/:budgetId/expenses/:expenseId', ExpenseController.updateExpense)
