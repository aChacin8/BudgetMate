import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";

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
