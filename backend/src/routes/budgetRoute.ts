import express from 'express';
import { BudgetController } from '../controller/budgetsController';

export const budgetRouter = express.Router();

budgetRouter.post('/budgets', BudgetController.createbudget)
budgetRouter.get('/budgets', BudgetController.getBudgets)