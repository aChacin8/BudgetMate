import express from 'express';

import { BudgetController } from '../controllers/BudgetsControllers';
import { ExpenseController } from '../controllers/ExpenseController';

import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudgetInput, validateBudgetById, validateBudgetExists } from '../middlewares/validateBudget';
import { validateExpenseById, validateExpenseExists, validateExpenseInput } from '../middlewares/validateExpense';

export const budgetRouter = express.Router();

budgetRouter.param('budgetId', validateBudgetById)
budgetRouter.param('budgetId', validateBudgetExists)

budgetRouter.param('expenseId', validateExpenseById)
budgetRouter.param('expenseId', validateExpenseExists)

budgetRouter.post('', 
                validateBudgetInput,
                handleInputErrors,
                BudgetController.createbudget
                );

budgetRouter.get('', BudgetController.getBudgets)

budgetRouter.get('/:budgetId', handleInputErrors, BudgetController.getBudgetById);

budgetRouter.patch('/:budgetId',
                validateBudgetInput,
                handleInputErrors,
                BudgetController.updateBudget
            );

budgetRouter.delete('/:budgetId', handleInputErrors, BudgetController.deleteBudget);

budgetRouter.post('/:budgetId/expenses', 
            validateExpenseInput, 
            handleInputErrors, 
            ExpenseController.createExpense
        );

budgetRouter.get('/:budgetId/expenses/:expenseId', handleInputErrors, ExpenseController.getExpenseById);

budgetRouter.patch('/:budgetId/expenses/:expenseId', 
            validateExpenseInput, 
            handleInputErrors, 
            ExpenseController.updateExpense
        );
        
budgetRouter.delete('/:budgetId/expenses/:expenseId',handleInputErrors,ExpenseController.deleteExpense)