import Expense from "../models/earning/EarningExpense";
import BudgetExpense from "../models/budget/BudgetExpense";
import Budget from "../models/budget/Budget";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
            budget?: Budget;
            budgetExpense?: BudgetExpense;
        }
    }
}
