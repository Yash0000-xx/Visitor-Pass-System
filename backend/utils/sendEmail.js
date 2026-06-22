const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    console.log("--> [EMAIL] Attempting Port 587 TLS Bypass...");

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Changed from 465
        secure: false, // MUST be false for port 587
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Helps bypass strict server checks
        }
    });

    try {
        await transporter.sendMail({ 
            from: process.env.EMAIL_USER, 
            to, 
            subject, 
            text 
        });
        console.log("--> [EMAIL] Success! Email sent.");
    } catch (error) {
        console.log("--> [EMAIL] FAILED:", error.message);
        throw error;
    }
};

module.exports = sendEmail;