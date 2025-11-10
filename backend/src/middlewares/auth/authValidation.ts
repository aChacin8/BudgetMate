import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body, param } from 'express-validator';

export const authValidation = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if(!bearer) {
        const error = new Error ('Authorization token required')
        return res.status(401).send(error)
    }

    const [, token] = bearer.split(' ')

    if (!token){
        const error= new Error ('Token no sent, Not Authorized')
        return res.status(401).json({ error: error.message })
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        
    }
}

export const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .run(req);
    await body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 6 characters long')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
        .run(req);
    next();
}

export const forgotPasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .run(req);
    next();
}

export const resetPasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    await param ('token')
        .notEmpty().withMessage('Token is required')
        .isNumeric().withMessage('Token must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 digits long')
        .run(req)
    await body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 6 characters long')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
        .run(req);
    next();
}