import { Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';

import { verifyJWT } from '../../utils/jwt';
import User from '../../models/user/User';
import { CryptoEmail } from '../../utils/cryptoEmail';

export const authValidation = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }
    
    const [, token] = bearer.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, Token not sent' });
    }

    try {
        const result = verifyJWT(token);

        if (typeof result !== 'object' || !result.id) {
            return res.status(401).json({ message: 'Unauthorized, Invalid token payload' });
        }

        const user = await User.findByPk(result.id, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'nonce', 'emailHash', 'isConfirmed', 'createdAt', 'updatedAt']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const decryptedEmail = CryptoEmail.decryptEmail(user.email, user.nonce);
        user.email = decryptedEmail;
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: 'Unauthorized, Invalid token' });
    }
};

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

