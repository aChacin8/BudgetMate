import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import Earning from "../../models/earning/Earning";

export const validateEarningInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('baseAmount')
        .notEmpty().withMessage('Base amount is required')
        .isNumeric().withMessage('Base amount must be a number')
        .custom((value) => value > 0).withMessage('Base amount must be greater than 0')
        .run(req);

    await body("periodType")
        .notEmpty().withMessage("Period type is required")
        .isIn(["monthly", "biweekly"]).withMessage("Period type must be either 'monthly' or 'biweekly'")
        .run(req);

    await body("periodMonth")
        .notEmpty().withMessage("Period month is required")
        .isNumeric().withMessage("Period month must be a number")
        .run(req);

    await body("periodYear")
        .notEmpty().withMessage("Period year is required")
        .isNumeric().withMessage("Period year must be a number")
        .run(req);

    next();
}

export const validateEarning = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { earningId } = req.params;
        const earning = await Earning.findOne({
            where: {
                id: earningId,
                userId: req.user.id
            }
        })
        if (!earning){
            return res.status(404).json({ message: "Earning not found" });
        }
        req.earning = earning;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}