import express from 'express';

import { BudgetController } from '../controllers/BudgetsControllers';
import { BudgetExpenseController } from '../controllers/BudgetExpenseController';

import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudgetInput, validateBudgetById, validateBudgetExists } from '../middlewares/validateBudget';
import { validateBudgetExpenseById, validateBudgetExpenseExists, validateExpenseInput } from '../middlewares/validateBudgetExpense';
import BudgetExpense from '../models/BudgetExpense';

export const budgetRouter = express.Router();

budgetRouter.param('budgetId', validateBudgetById)
budgetRouter.param('budgetId', validateBudgetExists)

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

budgetRouter.get(
    '/:budgetId/budgetExpenses/:budgetExpenseId',
    validateBudgetExpenseExists,
    validateBudgetExpenseById,
    handleInputErrors,
    BudgetExpenseController.getBudgetExpenseById
);

budgetRouter.patch('/:budgetId/budgetExpenses/:budgetExpenseId',
    validateExpenseInput,
    validateBudgetExpenseExists,
    validateBudgetExpenseById,
    handleInputErrors,
    BudgetExpenseController.updateBudgetExpense
);

budgetRouter.delete('/:budgetId/budgetExpenses/:budgetExpenseId', handleInputErrors, BudgetExpenseController.deleteBudgetExpense)