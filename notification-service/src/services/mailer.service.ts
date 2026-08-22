import { transporter } from "../config/mailer.config";

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        transporter.sendMail({
            to,
            from: process.env.MAIL_USER,
            subject,
            html,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}