const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {

    console.log("--> [EMAIL] Starting email process. Forcing IPv4...");

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        family: 4 
    });

    try {
        await transporter.sendMail({ 
            from: process.env.EMAIL_USER, 
            to, 
            subject, 
            text 
        });
        console.log("--> [EMAIL] Success! Email sent to Google servers.");
    } catch (error) {
        console.log("--> [EMAIL] FAILED:", error.message);
        throw error;
    }
};

module.exports = sendEmail;