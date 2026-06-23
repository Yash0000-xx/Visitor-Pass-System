const express = require('express');
const QRCode = require('qrcode');
const Pass = require('../models/Pass');
const Appointment = require('../models/Appointment');
const router = express.Router();

router.post('/generate/:appointmentId', async (req, res) => {
    let targetApptId = req.params.appointmentId;

    if (!targetApptId) {
        return res.status(400).json({ error: "Missing appointment ID in URL" });
    }

    try {
        let foundAppt = await Appointment.findById(targetApptId).populate('visitorId');
        
        if (!foundAppt) {
            return res.status(404).json({ error: "No appointment found with that ID" });
        }

        if (foundAppt.status !== 'Approved') {
            return res.status(400).json({ error: "You can only generate passes for approved appointments" });
        }

        let qrPayload = {
            appointmentId: foundAppt._id,
            visitorName: foundAppt.visitorId.name,
            hostId: foundAppt.hostId
        };
        
        let stringPayload = JSON.stringify(qrPayload);
        let generatedQr = await QRCode.toDataURL(stringPayload);

        let expirationDate = new Date(foundAppt.date);
        expirationDate.setHours(23, 59, 59);

        let newVisitorPass = new Pass({
            appointmentId: foundAppt._id,
            qrCodeData: generatedQr,
            validUntil: expirationDate
        });

        await newVisitorPass.save();
        
        res.status(201).json({ 
            msg: "Digital pass created", 
            passData: newVisitorPass 
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to create the visitor pass" });
    }
});

module.exports = router;