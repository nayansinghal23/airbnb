import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER || "nayansinghal393@gmail.com",
        pass: process.env.MAIL_PASS || "zvic cipm exit yypq",
    },
});