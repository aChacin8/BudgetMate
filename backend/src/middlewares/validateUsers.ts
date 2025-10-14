import { Request, Response, NextFunction } from "express";
import { body, param } from 'express-validator';

import User from '../models/user/User';

export const validateUserInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('firstName')
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 50 }).withMessage('First name must have a maximum of 50 characters')
        .run(req);
    await body ('lastName')
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 50 }).withMessage('First name must have a maximum of 50 characters')
        .run(req);
    await body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .run(req);
    await body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one highercase letter')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
        .run(req);
    next();
}

export const validateUserById = async (req: Request, res: Response, next: NextFunction) => {
    await param('userId')
        .isInt().withMessage('Invalid ID')
        .custom((value) => value > 0).withMessage('ID must be greater than 0')
        .run(req)

    next();
}

export const validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        const err = new Error('Failed to get user by id')
        res.status(500).json({ message: err.message })
    }
}