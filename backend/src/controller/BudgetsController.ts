import { Request, Response} from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static createbudget = async (req: Request, res: Response)=> {
        try {
            const budgets = await Budget.create(req.body)
            res.status(201).json(budgets)
        } catch (error) {
            const err = new Error ('Failed to create budgets')
            res.status(500).json({message: err.message})
        }
    }

    static getBudgets = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll()
            res.json(budgets)
        } catch (error) {
            const err = new Error ('Failed to get budgets')
            res.status(500).json({message: err.message})
        }
    }
} 