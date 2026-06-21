const twilio = require('twilio');

const sendSMS = async (toPhone, messageBody) => {
    try {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
            console.log(`\n--- MOCK SMS NOTIFICATION ---`);
            console.log(`To: ${toPhone}`);
            console.log(`Message: ${messageBody}`);
            console.log(`-----------------------------\n`);
            return true;
        }

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: toPhone
        });
        
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return false;
    }
};

module.exports = sendSMS;