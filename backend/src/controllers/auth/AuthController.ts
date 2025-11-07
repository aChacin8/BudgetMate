import { Request, Response } from "express";

import User from "../../models/user/User";
import { comparePassword, hashPassword } from "../../utils/hash";
import { CryptoEmail } from "../../utils/cryptoEmail";
import { generateToken } from "../../utils/token";
import { AuthEmail } from "../../emails/AuthEmail";
import { generateJWT } from "../../utils/jwt";

export class AuthController {
    static createUser = async (req: Request, res: Response) => {
        const { email, password, token, ...rest } = req.body;

        try {
            const emailHash = await CryptoEmail.hashEmail(email);
            const userExists = await User.findOne({ where: { email: emailHash } });

            if (userExists) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const { encrypted, nonce } = CryptoEmail.encryptEmail(email);
            
            const user = await User.create({
                ...rest,
                email: encrypted,
                nonce,
                emailHash,
                password: await hashPassword(password),
                token: generateToken()
            })

            await user.save();

            await AuthEmail.sendConfirmEmail({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                nonce: user.nonce,
                token: user.token
            })

            res.status(201).json({message: 'User created successfully. Please confirm your email.'});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;
        console.log(token);

        try {
            const user = await User.findOne({ where: { token } });
            if (!user) {
                return res.status(404).json({ message: 'Invalid token code' });
            }
            user.isConfirmed = true;
            user.token = null;
            await user.save();

            return res.status(200).json({ message: 'Account confirmed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body

        try {
            const { encrypted, nonce } = CryptoEmail.encryptEmail(email);

            const emailHash = await CryptoEmail.hashEmail(email);
            const user = await User.findOne({ where: { email: emailHash } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.isConfirmed === false) {
                return res.status(403).json({ message: 'Account not confirmed' });
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const jwt = generateJWT(user.id);

            return res.status(200).json({
                message: 'Login successful',
                jwt
            })
        } catch (error) {
            console.log(email);

            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}