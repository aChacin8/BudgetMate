import { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpenseController {
    static createExpense = async (req: Request, res: Response) => {
        try {
            const expense = await Expense.create(req.body)
            expense.save()
            res.status(201).json('Expense created successfully')
        } catch (error) {
            const err = new Error ('Failed to create expense')
            res.status(500).json({message: err.message})
        }
    }

    static getExpenses = async (req: Request, res: Response) => {
        try {
            const expenses = await Expense.findAll({
                order: [['amount', 'DESC']],
            })
            if (!expenses){
            return res.status(404).json({message: 'Expenses not found'})
        }
        } catch (error) {
            const err = new Error ('Failed to get expenses')
            res.status(500).json({message: err.message})
        }
    }

    static getExpenseById = async (req: Request, res: Response) => {    
        res.json(req.expense)
    }

    static updateExpense = async (req: Request, res: Response) => {
        await req.expense.update(req.body)
    }

    static deleteExpense = async (req: Request, res: Response) => {
        await req.expense.destroy(req.body)
    }
}