import { Request, Response} from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getBudgets = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll();
            res.send(200).json(budgets)
        } catch (error) {
            const err = new Error ('Failed to get budgets')
            res.status(500).json({message: err.message})
        }
    }
} 