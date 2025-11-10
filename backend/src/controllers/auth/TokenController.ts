import { Request, Response } from "express";
import User from "../../models/user/User";

export class TokenController {
    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;

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
}