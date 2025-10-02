import Expense from "../models/Expense";
import BudgetExpense from "../models/BudgetExpense";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
            budget?: Budget;
            budgetExpense?: BudgetExpense;
        }
    }
}
