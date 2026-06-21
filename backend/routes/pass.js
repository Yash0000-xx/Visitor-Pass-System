
const express = require('express');
const QRCode = require('qrcode');
const Pass = require('../models/Pass');
const Appointment = require('../models/Appointment');
const router = express.Router();


router.post('/generate/:appointmentId', async (req, res) => {
    try {
       
        const appointment = await Appointment.findById(req.params.appointmentId).populate('visitorId');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        if (appointment.status !== 'Approved') {
            return res.status(400).json({ message: 'Cannot issue pass. Appointment is not approved yet.' });
        }

        
        const qrData = JSON.stringify({ 
            appointmentId: appointment._id, 
            visitorName: appointment.visitorId.name,
            hostId: appointment.hostId
        });
        
      
        const qrCodeImage = await QRCode.toDataURL(qrData);

        const validUntil = new Date(appointment.date);
        validUntil.setHours(23, 59, 59);

       
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