import type { Request, Response } from "express"
import BudgetExpense from "../../models/budget/BudgetExpense"

export class BudgetExpenseController {
    static createBudgetExpense = async (req: Request, res: Response) => {
        try {
            const expense = await BudgetExpense.create({
                ...req.body,
                userId: req.user.id,
                budgetId: req.budget.id
            })
            expense.budgetId = req.budget.id
            expense.save()
            res.status(201).json('Budget Expense created successfully')
        } catch (error) {
            const err = new Error('Failed to create expense')
            res.status(500).json({ message: err.message })
        }
    }

    static getBudgetExpenses = async (req: Request, res: Response) => {
        try {
            const budgetExpenses = await BudgetExpense.findAll({
                where: {
                    userId: req.user.id,
                    budgetId: req.budget.id
                }
            })
            if(!budgetExpenses){
                return res.status(404).json({ message: 'Budget Expenses not found' })
            }
            res.json(budgetExpenses)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static getBudgetExpenseById = async (req: Request, res: Response) => {
        res.json(req.budgetExpense);
    };


    static updateBudgetExpense = async (req: Request, res: Response) => {
        await req.budgetExpense.update(req.body)
        res.json('Budget Expense updated sucessfully')
    }

    static deleteBudgetExpense = async (req: Request, res: Response) => {
        await req.budgetExpense.destroy()
        res.json('Budget Expense deleted successfully')
    }
}
