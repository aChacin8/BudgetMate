import { Request, Response } from "express";    

import User from "../../models/user/User";
import { hashPassword } from "../../utils/hash";
import { CryptoEmail } from "../../utils/cryptoEmail";
import { generateToken } from "../../utils/token";
import { AuthEmail } from "../../emails/AuthEmail";

export class AuthController {
    static createUser = async (req: Request, res: Response) =>{
        const { email, password, token, ...rest } = req.body;
        
        const userExists = await User.findOne({where: { email}});
        if(userExists){
            return res.status(409).json({ message: 'User already exists'});
        }
        
        try { 
            const { encrypted, nonce } = CryptoEmail.encryptEmail(email);
            
            const user = await User.create({
                ...rest,
                email: encrypted,
                nonce: nonce,
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
            
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static loginUser = async (req: Request, res: Response) => {
        const user = await User.findOne({where: { email: req.body.email }});

        if(!user){
            return res.status(404).json({ message: 'User not found'});
        }
        res.json(user);
    }
}