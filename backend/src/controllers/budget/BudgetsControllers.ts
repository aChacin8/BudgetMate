import { Request, Response} from 'express'
import Budget from '../../models/budget/Budget'
import BudgetExpense from "../../models/budget/BudgetExpense";

export class BudgetController {
    static createbudget = async (req: Request, res: Response)=> {
        try {
            const budgets = await Budget.create(req.body)
            await budgets.save()
            res.status(201).json(budgets)    
        } catch (error) {
            const err = new Error ('Failed to create budgets')
            res.status(500).json({message: err.message})
        }
    }

    static getBudgets = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [['amount', 'DESC']],
            })
            if (!budgets){
            return res.status(404).json({message: 'Budgets not found'})
        }
            res.json(budgets)
        } catch (error) {
            const err = new Error ('Failed to get budgets')
            res.status(500).json({message: err.message})
        }
    }

    static getBudgetById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id , {
            include: [BudgetExpense]
        })
        res.json(budget)
    }

    static updateBudget = async (req: Request, res: Response) => {
        await req.budget.update(req.body)
        res.json('Budget updated successfully!')
    }

    static deleteBudget = async (req: Request, res: Response) => {
        await req.budget.destroy()
        res.json('Budget deleted')
    }
} 