import { transport } from "../config/nodemailer";
import { IEmail } from "../interface/email";
import { CryptoEmail } from "../utils/cryptoEmail";

export class AuthEmail {
    static sendConfirmEmail = async (user: IEmail) => {
        try {            
            const decryptedEmail = CryptoEmail.decryptEmail(user.email, user.nonce);

            await transport.sendMail({
                from: `"BudgetMate" <${process.env.EMAIL_USER}>`,
                to: decryptedEmail, 
                subject: 'BudgetMate - Confirm your email',
                html: `
                    <h1>Hello ${user.firstName} ${user.lastName}</h1>
                    <p>Thank you for registering with BudgetMate. 
                        Please confirm your email by clicking the link below:
                    </p> 
                    <a href='#'>Confirm Email</a>
                    <p>Enter the code: <b>${user.token}</b></p>
                    <p>If you did not create an account, please ignore this email.</p>
                `
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    static sendResetPasswordEmail = async (user: IEmail) => {
        try {
            const decryptedEmail = CryptoEmail.decryptEmail(user.email, user.nonce);

            await transport.sendMail({
                from: `"BudgetMate" <${process.env.EMAIL_USER}>`,
                to: decryptedEmail, 
                subject: 'BudgetMate - Confirm your email',
                html: `
                    <h1>Hello ${user.firstName} ${user.lastName}</h1>
                    <p>You have requested to reset your password.
                        Please confirm your email by clicking the link below:
                    </p> 
                    <a href='#'>Reset Password</a>
                    <p>Enter the code: <b>${user.token}</b></p>
                    <p>If you did not request a password reset, please ignore this email.</p>`
            });
        } catch (error) {
            console.error('Error sending reset password email:', error);
            throw error;
        }
    }
}
