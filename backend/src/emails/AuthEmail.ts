import { transport } from "../config/nodemailer";
import { IEmail } from "../interface/email";

export class AuthEmail {
    static sendConfirmEmail = async (user : IEmail) => {
        const email = await transport.sendMail({
            from: 'BudgetMate '
        })
    }
}