import { Request, Response } from "express";
import EarningExtras from "../../models/earning/EarningExtra";

export class ExtraController {
    static createExtra = async (req: Request, res: Response) => {
        try {
            const extras = await EarningExtras.create({
                ...req.body,
                userId: req.user.id
            })

            if(!extras){
                return res.status(400).json({ message: 'Failed to create extra earning' })
            }
            extras.save()
            res.status(201).json({ message: 'Extra Earning created successfully', extras})
        } catch (error) {
            const err = new Error ('Internal Server Error')
            res.status(500).json({message: err.message})
        }
    }

    static getExtras = async (req: Request, res: Response) => {
        try {
            const extras = await EarningExtras.findAll({
                order: [['amount', 'DESC']],
                where: {
                    userId: req.user.id
                }
            })
            if (!extras){
            return res.status(404).json({message: 'Extra earnings not found'})
        }
            res.status(200).json(extras)
        } catch (error) {
            const err = new Error ('Internal Server Error')
            res.status(500).json({message: err.message})
        }
    }

    static getExtraById = async (req: Request, res: Response) => {
        res.json(req.extraEarning);
    }

    static updateExtra = async (req: Request, res: Response) => {
        req.extraEarning.update(req.body);
    }

    static deleteExpense = async (req: Request, res: Response) => {
        await req.extraEarning.destroy(req.body)
        res.json('Extra earnig delete successfully!')
    }
}