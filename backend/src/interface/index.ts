import User from "../models/user/User";
import BudgetExpense from "../models/budget/BudgetExpense";
import Budget from "../models/budget/Budget";
import Expense from "../models/earning/EarningExpense";
import EarningExtras from "../models/earning/EarningExtra";
import Earning from "../models/earning/Earning";


declare global {
    namespace Express {
        interface Request {
            user?: User;
            foundUser?: User;
            earning?: Earning;
            expense?: Expense;
            budget?: Budget;
            budgetExpense?: BudgetExpense;
            extraEarning?: EarningExtras;
        }
    }
}
