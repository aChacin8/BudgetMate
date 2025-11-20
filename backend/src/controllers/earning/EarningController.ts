import { Request, Response } from "express";

import Earning from "../../models/earning/Earning";

export class EarningController {
    static createEarning = async (req: Request, res: Response) => {
        try {
            const earning = await Earning.create(req.body)
            earning.userId = req.user.id

            await earning.save()
            res.status(201).json('Earning created successfully')
        } catch (error) {
            return res.status(500).json({message: 'Failed to create earning'})
        }
    }
}