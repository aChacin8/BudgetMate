import { Request, Response } from "express";

import Earning from "../../models/earning/Earning";

export class EarningController {
    static createEarning = async (req: Request, res: Response) => {
        try {
            const earning = await Earning.create({
                ...req.body,
                userId: req.user.id
            })
            if(!earning){
                return res.status(400).json({ message: 'Failed to create earning' })
            }
            await earning.save()
            res.status(201).json({ message:'Earning created successfully', earning })
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    };

    static getEarnings = async (req: Request, res: Response) => {
        try {
            const earning = await Earning.findAll({
                where: {
                    userId: req.user.id
                }
            })
            if (!earning) {
                return res.status(404).json({ message: 'Earnings not found' })
            }
            res.status(200).json({ message: 'Earnings retrieved successfully', earning })
        } catch (error) {
            return res.status(500).json({ message: 'Failed to retrieve earnings' })
        }
    };

    static updateEarning = async (req: Request, res: Response) => {
        req.earning.update(req.body);
    };
}