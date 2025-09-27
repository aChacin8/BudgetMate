import type { Request, Response } from "express"
import Expense from "../models/Expense"

export class ExpenseController {
    static createExpense = async (req: Request, res: Response) => {
        try {
            const expense = await Expense.create(req.body)
            expense.budgetId = req.budget.id
            expense.save()
            res.status(201).json('Expense created successfully')
        } catch (error) {
            const err = new Error ('Failed to create expense')
            res.status(500).json({message: err.message})
        }
    }

    static getExpenseById = async (req: Request, res: Response) => {
        
    }
    
    static updateExpense = async (req: Request, res: Response) =>{

    }

    static deleteExpense = async (req: Request, res: Response) => {

    }
}
