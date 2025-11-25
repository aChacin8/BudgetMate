import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { Op } from "sequelize"; //To use operator with sequelize

import Earning from "../../models/earning/Earning";
import User from "../../models/user/User";

export const earningValidation = async (req: Request, res: Response, next: NextFunction) => {

    await body('baseAmount')
        .notEmpty().withMessage('Base amount is required')
        .isNumeric().withMessage('Base amount must be a number')
        .custom((value) => value > 0).withMessage('Base amount must be greater than 0')
        .run(req);

    await body("periodStart")
        .notEmpty().withMessage("Period start date is required")
        .isISO8601().withMessage("Invalid period start date format")
        .run(req);

    await body("periodEnd")
        .notEmpty().withMessage("Period end date is required")
        .isISO8601().withMessage("Invalid period end date format")
        .run(req);

    next();
}


export const earningPeriodValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const periodStart = new Date(req.body.periodStart);
        const periodEnd = new Date(req.body.periodEnd);

        req.body.userId = req.user.id;

        const existingEarning = await Earning.findOne({
            where: {
                userId: req.user.id,
                [Op.or]: [
                    {
                        periodStart: { [Op.between]: [periodStart, periodEnd] }
                    },
                    {
                        periodEnd: { [Op.between]: [periodStart, periodEnd] }
                    },
                    {
                        [Op.and]: [
                            { periodStart: { [Op.lt]: periodStart } },
                            { periodEnd: { [Op.gt]: periodEnd } }
                        ]
                    }
                ]
            }
        });

        if (existingEarning) {
            return res.status(400).json({ message: 'An earning already exists for this period.' });
        }

        next();
    } catch (error) {
        return res.status(409).json({ message: "Overlapping creation periods" });
    }
}

