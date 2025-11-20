import express from 'express';

import { BudgetController } from '../controllers/budget/BudgetsControllers';
import { BudgetExpenseController } from '../controllers/budget/BudgetExpenseController';

import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudgetInput, validateBudgetById, validateBudgetExists } from '../middlewares/budget/validateBudget';
import { validateBudgetExpenseById, validateBudgetExpenseExists, validateExpenseInput } from '../middlewares/budget/validateBudgetExpense';
import { deleteLimiter, getLimiter, postLimiter } from '../config/limiter';
import { authValidation } from '../middlewares/auth/authValidation';

export const budgetRouter = express.Router();

budgetRouter.use(authValidation);

budgetRouter.param('budgetId', validateBudgetById)
budgetRouter.param('budgetId', validateBudgetExists)

budgetRouter.post('',
    postLimiter,
    validateBudgetInput,
    handleInputErrors,
    BudgetController.createbudget
);

budgetRouter.get('', getLimiter, BudgetController.getBudgets)

budgetRouter.get('/:budgetId', 
    getLimiter, 
    handleInputErrors, 
    BudgetController.getBudgetById
);

budgetRouter.patch('/:budgetId',
    getLimiter,
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateBudget
);

budgetRouter.delete('/:budgetId', deleteLimiter, handleInputErrors, BudgetController.deleteBudget);

budgetRouter.post('/:budgetId/budgetExpenses',
    postLimiter,
    validateExpenseInput,
    handleInputErrors,
    BudgetExpenseController.createBudgetExpense
);

budgetRouter.get(
    '/:budgetId/budgetExpenses/:budgetExpenseId',
    getLimiter,
    validateBudgetExpenseExists,
    validateBudgetExpenseById,
    handleInputErrors,
    BudgetExpenseController.getBudgetExpenseById
);

budgetRouter.patch('/:budgetId/budgetExpenses/:budgetExpenseId',
    postLimiter,
    validateExpenseInput,
    validateBudgetExpenseExists,
    validateBudgetExpenseById,
    handleInputErrors,
    BudgetExpenseController.updateBudgetExpense
);

budgetRouter.delete('/:budgetId/budgetExpenses/:budgetExpenseId', 
    deleteLimiter, 
    handleInputErrors, 
    BudgetExpenseController.deleteBudgetExpense
)