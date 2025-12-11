import nodemailer from 'nodemailer';
import { config } from './index';

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
});

export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
        filename: string;
        content?: string | Buffer;
        path?: string;
        contentType?: string;
    }>;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: `"${config.app.name}" <${config.email.from}>`,
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
            attachments: options.attachments,
        });

        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

export const verifyEmailConnection = async (): Promise<boolean> => {
    try {
        await transporter.verify();
        console.log('Email server connection verified');
        return true;
    } catch (error) {
        console.error('Email server connection error:', error);
        return false;
    }
};

export default { sendEmail, verifyEmailConnection, transporter };
