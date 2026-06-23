const twilio = require('twilio');

async function sendSMS(targetPhone, textMessage) {
    let mySid = process.env.TWILIO_ACCOUNT_SID;
    let myToken = process.env.TWILIO_AUTH_TOKEN;
    let twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!mySid || !myToken) {
        console.log("Cannot send SMS: Missing Twilio keys in environment variables");
        return false;
    }

    try {
        let myClient = twilio(mySid, myToken);

        await myClient.messages.create({
            body: textMessage,
            from: twilioNumber,
            to: targetPhone
        });
        
        console.log("Text message sent successfully to " + targetPhone);
        return true;

    } catch (err) {
        console.log("Failed to send text message");
        console.log(err);
        return false;
    }
}

module.exports = sendSMS;