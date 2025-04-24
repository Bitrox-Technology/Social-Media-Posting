import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    let email = await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: message,
        html: message 
    });
    return email;
};
export { sendEmail }