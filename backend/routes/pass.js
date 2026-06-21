// backend/routes/pass.js
const express = require('express');
const QRCode = require('qrcode');
const Pass = require('../models/Pass');
const Appointment = require('../models/Appointment');
const router = express.Router();

// 1. GENERATE A DIGITAL PASS WITH QR CODE
router.post('/generate/:appointmentId', async (req, res) => {
    try {
        // Find the appointment and pull in the visitor's details
        const appointment = await Appointment.findById(req.params.appointmentId).populate('visitorId');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (appointment.status !== 'Approved') {
            return res.status(400).json({ message: 'Cannot issue pass. Appointment is not approved yet.' });
        }

        // Create the data string that the QR scanner will read
        const qrData = JSON.stringify({ 
            appointmentId: appointment._id, 
            visitorName: appointment.visitorId.name,
            hostId: appointment.hostId
        });
        
        // Convert that data into a base64 Image URL (This is your actual QR Code)
        const qrCodeImage = await QRCode.toDataURL(qrData);

        // Set expiration (e.g., end of the appointment day)
        const validUntil = new Date(appointment.date);
        validUntil.setHours(23, 59, 59);

        // Save the pass to the database
        const newPass = new Pass({
            appointmentId: appointment._id,
            qrCodeData: qrCodeImage,
            validUntil: validUntil
        });

        await newPass.save();
        res.status(201).json({ 
            message: 'Pass generated successfully!', 
            pass: newPass 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating pass', error: error.message });
    }
});

module.exports = router;