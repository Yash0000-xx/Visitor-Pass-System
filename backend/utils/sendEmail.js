const axios = require('axios');

const sendEmail = async (to, subject, text) => {
    console.log("--> [EMAIL] Bypassing SMTP. Sending via EmailJS API...");

    const data = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
            to_email: to,
            subject: subject,
            message: text
        }
    };

    try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
        console.log("--> [EMAIL] Success! Sent via EmailJS API.");
    } catch (error) {
        console.error("--> [EMAIL] FAILED:", error.response?.data || error.message);
        throw new Error('EmailJS failed to send');
    }
};

module.exports = sendEmail;