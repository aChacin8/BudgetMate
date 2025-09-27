import express from 'express';
import { body, param } from 'express-validator';

import { BudgetController } from '../controllers/BudgetsController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { validateBudget, validateBudgetById, validateBudgetExists } from '../middlewares/validateBudget';

export const budgetRouter = express.Router();

budgetRouter.post('/budgets', 
                validateBudget,
                handleInputErrors,
                BudgetController.createbudget
                );

budgetRouter.get('/budgets', BudgetController.getBudgets)

budgetRouter.get('/budgets/:id',
                validateBudgetById,
                validateBudgetExists,
                handleInputErrors,
                BudgetController.getBudgetById
            );

budgetRouter.patch('/budgets/:id',
                validateBudgetById,
                validateBudgetExists,
                validateBudget,
                handleInputErrors,
                BudgetController.updateBudget
            );

budgetRouter.delete('/budgets/:id', 
                validateBudgetById,
                validateBudgetExists,
                BudgetController.deleteBudget
            );