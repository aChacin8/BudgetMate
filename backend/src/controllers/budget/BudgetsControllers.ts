import { Request, Response} from 'express'
import Budget from '../../models/budget/Budget'
import BudgetExpense from "../../models/budget/BudgetExpense";

export class BudgetController {
    static createbudget = async (req: Request, res: Response)=> {
        try {
            const budgets = await Budget.create({
                ...req.body,
                userId: req.user.id,
                earningId: req.earning.id
            })
            if(!budgets){
                return res.status(400).json({ message: 'Failed to create budgets'})
            }
            await budgets.save()
            res.status(201).json(budgets)    
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static getBudgets = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [['amount', 'DESC']],
                where: {
                    userId: req.user.id,
                    earningId: req.earning.id
                }
            })
            if (!budgets){
            return res.status(404).json({message: 'Budgets not found'})
        }
            res.json(budgets)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    }

    static getBudgetById = async (req: Request, res: Response) => {
        res.json(req.budget);
    }

    static updateBudget = async (req: Request, res: Response) => {
        await req.budget.update(req.body)
        res.json('Budget updated successfully!')
    }

    static deleteBudget = async (req: Request, res: Response) => {
        await req.budget.destroy()
        res.json('Budget deleted successfully!')
    }
} 