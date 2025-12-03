import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from 'express-validator';
import User from '../../models/user/User';
import { CryptoEmail } from "../../utils/cryptoEmail";

export const validateUserInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('firstName')
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 50 }).withMessage('First name must have a maximum of 50 characters')
        .run(req);

    await body('lastName')
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 50 }).withMessage('Last name must have a maximum of 50 characters')
        .run(req);

    await body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .run(req);

    await body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
        .run(req);

    await body('phone')
        .optional()
        .isLength({ min: 7, max: 15 }).withMessage('Phone number must be between 7 and 15 digits')
        .isNumeric().withMessage('Phone number must contain only numbers')
        .run(req);

    // get validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { phone, email } = req.body;

        if (phone) {
            const phoneExists = await User.findOne({ where: { phone } });
            if (phoneExists) {
                return res.status(409).json({ message: 'This phone number is already used' });
            }
        }

        if (email) {
            const emailHash = await CryptoEmail.hashEmail(email);
            const emailExists = await User.findOne({ where: { emailHash } });
            if (emailExists) {
                return res.status(409).json({ message: 'This email is already used' });
            }
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    next();
};


export const validateUserById = async (req: Request, res: Response, next: NextFunction) => {
    await param('userId')
        .isInt({ min: 1 }).withMessage('ID must be a positive integer')
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};


export const validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.foundUser = user;

        next();

    } catch (error) {
        return res.status(500).json({ message: 'Failed to get user by id' });
    }
};
