import express from 'express';

import { BudgetController } from '../controllers/BudgetsControllers';
import { BudgetExpenseController } from '../controllers/BudgetExpenseController';

import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudgetInput, validateBudgetById, validateBudgetExists } from '../middlewares/validateBudget';
import { validateBudgetExpenseById, validateBudgetExpenseExists, validateExpenseInput } from '../middlewares/validateBudgetExpense';

export const budgetRouter = express.Router();

budgetRouter.param('budgetId', validateBudgetById)
budgetRouter.param('budgetId', validateBudgetExists)

budgetRouter.param('budgetExpenseId', validateBudgetExpenseById)
budgetRouter.param('budgetExpenseId', validateBudgetExpenseExists)

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

budgetRouter.post('/:budgetId/budgetExpenses', 
            validateExpenseInput, 
            handleInputErrors, 
            BudgetExpenseController.createBudgetExpense
        );

budgetRouter.get('/:budgetId/budgetExpenses/:budgetExpenseId', handleInputErrors, BudgetExpenseController.getBudgetExpenseById);

budgetRouter.patch('/:budgetId/budgetExpenses/:budgetExpenseId', 
            validateExpenseInput, 
            handleInputErrors, 
            BudgetExpenseController.updateBudgetExpense
        );

budgetRouter.delete('/:budgetId/budgetExpenses/:budgetExpenseId',handleInputErrors,BudgetExpenseController.deleteBudgetExpense)