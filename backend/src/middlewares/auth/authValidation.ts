import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

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
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .run(req);
}

export const forgotPasswordValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .run(req);
    next();
}