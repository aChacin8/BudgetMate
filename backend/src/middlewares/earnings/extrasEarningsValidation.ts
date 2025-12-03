import { Request, Response, NextFunction } from "express";
import { param, body } from "express-validator";

import ExtraEarnings from "../../models/earning/ExtraEarning";

export const validateExtraInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('source')
        .notEmpty().withMessage('Source is required')
        .isLength({ max: 50}).withMessage('Source must have a maximum of 50 characters')
        .run(req)
    await body('amount')
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number')
        .custom((value) => value > 0).withMessage('Amount must be greater than 0')
        .run(req)
    next();
}

export const validateExtraEarningById = async (req: Request, res: Response, next: NextFunction) => {
    await param('extraEarningId')
        .isInt().withMessage('Invalid ID')
        .custom((value) => value > 0).withMessage('ID must be greater than 0')
        .run(req)

    next();
}

export const validateExtraEarningExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { extraEarningId, earningId} = req.params;

        const extraEarnings = await ExtraEarnings.findByPk(extraEarningId);

        if (!extraEarnings){
            return res.status(404).json({ message: 'Extra earning not found' });
        }
        req.extraEarning = extraEarnings;
    } catch (error) {
        const err = new Error('Failed to get extra earning by id')
        res.status(500).json({ message: err.message })
    }
}