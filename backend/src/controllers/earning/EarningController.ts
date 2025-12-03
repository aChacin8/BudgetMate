import { Request, Response } from "express";

import Earning from "../../models/earning/Earning";

export class EarningController {
    static createEarning = async (req: Request, res: Response) => {
        try {
            const earning = await Earning.create(req.body)

            await earning.save()
            res.status(201).json('Earning created successfully')
        } catch (error) {
            return res.status(500).json({ message: 'Failed to create earning' })
        }
    };

    static getEarning = async (req: Request, res: Response) => {
        try {
            const earning = await Earning.findOne({
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
        const { earningId } = req.params;

        try {
            const { baseAmount, periodType, periodMonth, periodYear } = req.body;

            const earning = await Earning.findByPk(earningId);
            if (!earning) {
                return res.status(404).json({ message: "Earning doesn't exist" });
            }

            await earning.update({ baseAmount, periodType,periodMonth, periodYear });

            res.status(200).json({ message: "Earning updated successfully", earning });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}