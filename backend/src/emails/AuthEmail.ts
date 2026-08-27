import { transport } from "../config/nodemailer";
import { IEmail } from "../interface/email";
import { CryptoEmail } from "../utils/cryptoEmail";

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class AuthEmail {
    static sendConfirmEmail = async (user: IEmail) => {
        try {            
            const decryptedEmail = CryptoEmail.decryptEmail(user.email, user.nonce);
            const confirmUrl = `${FRONTEND_URL}/confirm-account`;

            await transport.sendMail({
                from: `"BudgetMate" <${process.env.EMAIL_USER}>`,
                to: decryptedEmail, 
                subject: 'BudgetMate - Confirma tu cuenta',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <span style="font-size: 48px;">💰</span>
                            <h1 style="color: #111827; font-size: 24px; margin: 8px 0 0;">BudgetMate</h1>
                        </div>
                        <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
                            <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px;">Hola, ${user.firstName} ${user.lastName} 👋</h2>
                            <p style="color: #6b7280; font-size: 15px; margin: 0 0 24px;">
                                Gracias por registrarte en BudgetMate. Para activar tu cuenta ingresa el siguiente código de 6 dígitos:
                            </p>
                            <div style="background: #f0fdf4; border: 2px dashed #10b981; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                                <span style="font-size: 36px; font-weight: bold; color: #059669; letter-spacing: 8px;">${user.token}</span>
                            </div>
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="${confirmUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 10px;">
                                    Ir a confirmar cuenta →
                                </a>
                            </div>
                            <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0;">
                                Si no creaste una cuenta en BudgetMate, puedes ignorar este correo.
                            </p>
                        </div>
                    </div>
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
            const resetUrl = `${FRONTEND_URL}/reset-password`;

            await transport.sendMail({
                from: `"BudgetMate" <${process.env.EMAIL_USER}>`,
                to: decryptedEmail, 
                subject: 'BudgetMate - Restablecer contraseña',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 32px; border-radius: 16px;">
                        <div style="text-align: center; margin-bottom: 24px;">
                            <span style="font-size: 48px;">💰</span>
                            <h1 style="color: #111827; font-size: 24px; margin: 8px 0 0;">BudgetMate</h1>
                        </div>
                        <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
                            <h2 style="color: #111827; font-size: 20px; margin: 0 0 12px;">Hola, ${user.firstName} ${user.lastName} 👋</h2>
                            <p style="color: #6b7280; font-size: 15px; margin: 0 0 24px;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el siguiente código:
                            </p>
                            <div style="background: #fff7ed; border: 2px dashed #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                                <span style="font-size: 36px; font-weight: bold; color: #d97706; letter-spacing: 8px;">${user.token}</span>
                            </div>
                            <div style="text-align: center; margin-bottom: 24px;">
                                <a href="${resetUrl}" style="display: inline-block; background: #f59e0b; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 10px;">
                                    Restablecer contraseña →
                                </a>
                            </div>
                            <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 0;">
                                Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
                            </p>
                        </div>
                    </div>
                `
            });
        } catch (error) {
            console.error('Error sending reset password email:', error);
            throw error;
        }
    }
}
