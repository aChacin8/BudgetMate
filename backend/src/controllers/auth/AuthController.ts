import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../../models/user/User";

export class AuthController {
    static createUser = async (req: Request, res: Response) =>{
        const { email } = req.body;
        const userExists = await User.findOne({where: { email}});
        if(userExists){
            return res.status(409).json({ message: 'User already exists'});
        }
        
        try { 
            const { password, ...rest } = req.body;
            const user = await User.create(
                {
                    ...rest,
                    password: await bcrypt.hash(password,10)
                }
            );
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}