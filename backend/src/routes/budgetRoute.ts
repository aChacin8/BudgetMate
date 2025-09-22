import express from 'express';
import { body, param } from 'express-validator';

import { BudgetController } from '../controllers/BudgetsController';
import { handleInputErrors } from '../middlewares/hadleInputErrors';

export const budgetRouter = express.Router();

budgetRouter.post('/budgets', 
                body('name')
                    .notEmpty().withMessage('Name is required'),
                body('amount')
                    .notEmpty().withMessage('Amount is required')
                    .isNumeric().withMessage('Amount must be a number')
                    .custom((value) => value > 0).withMessage('Amount must be greater than 0'),
                handleInputErrors,
                BudgetController.createbudget
                );

budgetRouter.get('/budgets', BudgetController.getBudgets)

budgetRouter.get('/budgets/:id',
                param('id')
                    .isInt().withMessage('Invalid ID')
                    .custom((value) => value > 0).withMessage('ID must be greater than 0'),
                handleInputErrors,
                BudgetController.getBudgetById)

budgetRouter.patch('/budgets/:id',
                param('id')
                    .isInt().withMessage('Invalid ID')
                    .custom((value) => value > 0).withMessage('ID must be greater than 0'),
                body('name')
                    .notEmpty().withMessage('Name is required'),
                body('amount')
                    .notEmpty().withMessage('Amount is required')
                    .isNumeric().withMessage('Amount must be a number')
                    .custom((value) => value > 0).withMessage('Amount must be greater than 0'),
                handleInputErrors,
                BudgetController.updateBudget)

budgetRouter.delete('/budgets/:id', 
                param('id')
                    .isInt().withMessage('Invalid ID')
                    .custom((value) => value > 0).withMessage('ID must be greater than 0'),
                BudgetController.deleteBudget)