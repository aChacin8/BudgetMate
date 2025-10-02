import express from 'express';

import { BudgetController } from '../controllers/BudgetsControllers';
import { BudgetExpenseController } from '../controllers/BudgetExpenseController';

import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudgetInput, validateBudgetById, validateBudgetExists } from '../middlewares/validateBudget';
import { validateExpenseById, validateExpenseExists, validateExpenseInput } from '../middlewares/validateBudgetExpense';

export const budgetRouter = express.Router();

budgetRouter.param('budgetId', validateBudgetById)
budgetRouter.param('budgetId', validateBudgetExists)

budgetRouter.param('budgetExpenseId', validateExpenseById)
budgetRouter.param('budgetExpenseId', validateExpenseExists)

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
            BudgetExpenseController.createExpense
        );

budgetRouter.get('/:budgetId/budgetExpenses/:budgetExpenseId', handleInputErrors, BudgetExpenseController.getExpenseById);

budgetRouter.patch('/:budgetId/budgetExpenses/:budgetExpenseId', 
            validateExpenseInput, 
            handleInputErrors, 
            BudgetExpenseController.updateExpense
        );
        
budgetRouter.delete('/:budgetId/budgetExpenses/:budgetExpenseId',handleInputErrors,BudgetExpenseController.deleteExpense)