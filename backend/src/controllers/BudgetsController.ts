import { Request, Response} from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static createbudget = async (req: Request, res: Response)=> {
        try {
            const budgets = await Budget.create(req.body)
            if (!budgets){
            return res.status(404).json({message: 'Budgets not created'})
        }
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
        try {
            const { id } = req.params
            const budget = await Budget.findOne({where: {id}})
        if (!budget){
            return res.status(404).json({message: 'Budget not found'})
        }
            res.json(budget)
        } catch (error) {
            const err = new Error ('Failed to get budget by id')
            res.status(500).json({message: err.message})
        }
    }

    static updateBudget = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const budget = await Budget.findOne({where: {id}})
            if (budget){
                await budget.update(req.body)
            } else {
                res.status(404).json({message: 'Budget not found, cannot update'})
            }
            res.json(budget)
        } catch (error) {
            const err = new Error ('Failed to update budget')
            res.status(500).json({message: err.message})
        }
    }

    static deleteBudget = async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const budget = await Budget.findOne({where: {id}})
            if (budget){
                await budget.destroy()
            } else {
                res.status(404).json({message: 'Budget not found, cannot delete'})
            }
            res.json(budget)
        } catch (error) {
            const err = new Error ('Failed to delete budget')
            res.status(500).json({message: err.message})
        }
    }
} 