import { Request, Response } from "express";
import EarningExpense from "../../models/earning/EarningExpense";

export class ExpenseController {
    static createExpense = async (req: Request, res: Response) => {
        try {
            const expense = await EarningExpense.create({
                ...req.body,
                userId: req.user.id
            })
            if(!expense){
                return res.status(400).json({ message: 'Failed to create expense' })
            }
            expense.save()
            res.status(201).json('Expense created successfully')
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static getExpenses = async (req: Request, res: Response) => {
        try {
            const expenses = await EarningExpense.findAll({
                order: [['amount', 'DESC']],
                where: {
                    userId: req.user.id
                }
            })
            if (!expenses){
            return res.status(404).json({message: 'Expenses not found'})
        }
            res.json(expenses)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
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