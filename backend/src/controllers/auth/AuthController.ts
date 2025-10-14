import { Request, Response } from "express";    

import User from "../../models/user/User";
import { hashPassword } from "../../utils/hash";
import { CryptoEmail } from "../../utils/cryptoEmail";

export class AuthController {
    static createUser = async (req: Request, res: Response) =>{
        const { email, password, ...rest } = req.body;
        
        const userExists = await User.findOne({where: { email}});
        if(userExists){
            return res.status(409).json({ message: 'User already exists'});
        }
        
        try { 
            const { encrypted, nonce } = CryptoEmail.encryptEmail(email);
            
            const user = await User.create({
                ...rest,
                email__encrypted: encrypted,
                nonce: nonce,
                password: await hashPassword(password)
            })

            await user.save();
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