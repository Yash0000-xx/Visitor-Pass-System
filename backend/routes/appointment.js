const express = require('express');
const Appointment = require('../models/Appointment');
const axios = require('axios');
const router = express.Router();

router.post('/request', async (req, res) => {
    let reqData = req.body;

    if (!reqData.visitorId || !reqData.hostId || !reqData.date || !reqData.time) {
        return res.status(400).json({ error: "Please provide all required appointment details" });
    }

    try {
        let newAppt = new Appointment({
            visitorId: reqData.visitorId,
            hostId: reqData.hostId,
            date: reqData.date,
            time: reqData.time
        });
        
        await newAppt.save();
        
        res.status(201).json({ msg: "Appointment requested successfully", appointment: newAppt });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not save the appointment" });
    }
});

router.put('/status/:id', async (req, res) => {
    let newStatus = req.body.status;

    if (!newStatus) {
        return res.status(400).json({ error: "No status provided to update" });
    }

    try {
        let appt = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status: newStatus }, 
            { new: true }
        ).populate('visitorId');

        if (!appt) {
            return res.status(404).json({ error: "Appointment not found in database" });
        }

        if (newStatus === 'Approved' && appt.visitorId && appt.visitorId.email) {
            try {
                let mailConfig = {
                    service_id: process.env.EMAILJS_SERVICE_ID,
                    template_id: process.env.EMAILJS_TEMPLATE_ID,
                    user_id: process.env.EMAILJS_PUBLIC_KEY,
                    accessToken: process.env.EMAILJS_PRIVATE_KEY,
                    template_params: {
                        to_email: appt.visitorId.email,
                        subject: "Appointment Approved",
                        message: "Your visitor appointment has been officially approved. Please proceed to the front desk when you arrive."
                    }
                };

                await axios.post('https://api.emailjs.com/api/v1.0/email/send', mailConfig);
                console.log("Live email sent to visitor");
            } catch (emailErr) {
                console.log(emailErr);
            }
        }

        res.status(200).json({ msg: "Appointment updated", data: appt });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server crashed while updating status" });
    }
});

module.exports = router;