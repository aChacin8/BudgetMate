import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { TransportConfig } from '../interface/email';

dotenv.config();

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

const configMail = () : TransportConfig => {
    return {
        host: EMAIL_HOST,
        port: +EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    }
}

export const transport = nodemailer.createTransport(configMail());


