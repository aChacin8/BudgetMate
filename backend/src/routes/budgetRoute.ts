import express from 'express';
import { body } from 'express-validator';

import { BudgetController } from '../controllers/BudgetsController';

export const budgetRouter = express.Router();

budgetRouter.post('/budgets', 
    body('name')
    .notEmpty()
    .withMessage('Name is required'),
    BudgetController.createbudget
    );
budgetRouter.get('/budgets', BudgetController.getBudgets)
budgetRouter.get('/budgets/:id', BudgetController.getBudgetById)
budgetRouter.patch('/budgets/:id', BudgetController.updateBudget)
budgetRouter.delete('/budgets/:id', BudgetController.deleteBudget)