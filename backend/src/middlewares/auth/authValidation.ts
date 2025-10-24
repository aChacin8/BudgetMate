import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import User from '../../models/user/User';

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