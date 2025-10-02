import type { Request, Response } from "express"
import BudgetExpense from "../models/BudgetExpense"

export class BudgetExpenseController {
    static createBudgetExpense = async (req: Request, res: Response) => {
        try {
            const expense = await BudgetExpense.create(req.body)
            expense.budgetId = req.budget.id
            expense.save()
            res.status(201).json('Expense created successfully')
        } catch (error) {
            const err = new Error ('Failed to create expense')
            res.status(500).json({message: err.message})
        }
    }

    static getBudgetExpenseById = async (req: Request, res: Response) => {    
        res.json(req.budgetExpense)
    }
    
    static updateBudgetExpense = async (req: Request, res: Response) =>{
        await req.budgetExpense.update(req.body)
        res.json('Expense updated sucessfully')
    }

    static deleteBudgetExpense = async (req: Request, res: Response) => {
        await req.budgetExpense.destroy()
    }
}
