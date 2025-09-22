import express from 'express';
import { body } from 'express-validator';

import { BudgetController } from '../controllers/BudgetsController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';

export const budgetRouter = express.Router();

budgetRouter.post('/budgets', 
                body('name')
                    .notEmpty()
                    .withMessage('Name is required'),
                body('amount')
                    .notEmpty()
                    .withMessage('Amount is required')
                    .isNumeric()
                    .withMessage('Amount must be a number')
                    .custom((value) => value > 0)
                    .withMessage('Amount must be greater than 0'),
                handleInputErrors,
                BudgetController.createbudget
                );
budgetRouter.get('/budgets', BudgetController.getBudgets)
budgetRouter.get('/budgets/:id', BudgetController.getBudgetById)
budgetRouter.patch('/budgets/:id', BudgetController.updateBudget)
budgetRouter.delete('/budgets/:id', BudgetController.deleteBudget)