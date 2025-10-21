import User from "../models/user/User";
import BudgetExpense from "../models/budget/BudgetExpense";
import Budget from "../models/budget/Budget";
import Expense from "../models/earning/EarningExpense";
import ExtraEarnings from "../models/earning/ExtraEarning";


declare global {
    namespace Express {
        interface Request {
            user?: User;
            expense?: Expense;
            budget?: Budget;
            budgetExpense?: BudgetExpense;
            extraEarning?: ExtraEarnings;
        }
    }
}
