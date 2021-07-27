const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html, from = process.env.MAIL_FROM }) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    await transporter.sendMail({ from, to, subject, html });
}

module.exports = sendEmail;