const axios = require('axios');

async function sendEmail(targetEmail, mailSubject, mailBody) {
    console.log("Attempting to send email to: " + targetEmail);

    let emailPayload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
            to_email: targetEmail,
            subject: mailSubject,
            message: mailBody
        }
    };

    try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailPayload);
        console.log("Email sent successfully!");
    } catch (err) {
        console.log("Email failed to send");
        console.log(err);
        throw new Error("Could not send email via EmailJS");
    }
}

module.exports = sendEmail;