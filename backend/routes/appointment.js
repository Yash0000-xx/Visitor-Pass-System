// backend/routes/appointment.js
const express = require('express');
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer'); // <-- Import Email Library
const router = express.Router();

router.post('/request', async (req, res) => {
    try {
        const { visitorId, hostId, date, time } = req.body;
        const newAppointment = new Appointment({ visitorId, hostId, date, time });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment requested successfully!', appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting appointment', error: error.message });
    }
});

// APPROVE OR REJECT AN APPOINTMENT (With Email Notifications)
router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body; 

        // Populate visitorId so we can get their email address
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true }
        ).populate('visitorId');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // --- NEW: Email Notification Logic ---
        if (status === 'Approved') {
            try {
                // Set up a free testing email account (perfect for assignments)
                let testAccount = await nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false,
                    auth: { user: testAccount.user, pass: testAccount.pass }
                });

                // Send the email
                let info = await transporter.sendMail({
                    from: '"Security Desk" <security@office.com>',
                    to: appointment.visitorId.email,
                    subject: "Your Visitor Pass is Approved",
                    text: `Hello ${appointment.visitorId.name},\n\nYour appointment has been approved. Please collect your digital pass at the front desk.\n\nThank you.`,
                });

                console.log("Email Notification sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
            } catch (emailError) {
                console.error("Email failed to send, but appointment was approved.", emailError);
            }
        }
        // -------------------------------------

        res.status(200).json({ message: `Appointment ${status}!`, appointment });

    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

module.exports = router;