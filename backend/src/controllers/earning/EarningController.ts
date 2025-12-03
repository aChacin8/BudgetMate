import { Request, Response } from "express";

import Earning from "../../models/earning/Earning";

export class EarningController {
    static createEarning = async (req: Request, res: Response) => {
        try {
            const earning = await Earning.create({
                ...req.body,
                userId: req.user.id
            })

            await earning.save()
            res.status(201).json({ message:'Earning created successfully', earning })
        } catch (error) {
            return res.status(500).json({ message: 'Failed to create earning' })
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
        const { earningId } = req.params;

        try {
            const earning = await Earning.findOne({
                where: {
                    id: earningId,
                    userId: req.user.id
                }
            });
            if (!earning) {
                return res.status(404).json({ message: "Earning doesn't exist" });
            }

            await earning.update(req.body);

            res.status(200).json({ message: "Earning updated successfully", earning });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    };
}