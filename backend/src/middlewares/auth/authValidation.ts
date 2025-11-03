import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';

import User from '../../models/user/User';
import { isLength } from 'validator';

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

export const confirmAccountValidation = async (req: Request, res: Response, next: NextFunction) => {
    await body('token')
        .notEmpty().withMessage('Token is required')
        .isInt().withMessage('Token must be numeric')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 characters long')
        .run(req)

    next();
}