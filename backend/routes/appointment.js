// backend/routes/appointment.js
const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

// 1. REQUEST AN APPOINTMENT
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

// 2. APPROVE OR REJECT AN APPOINTMENT
router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body; // Expects 'Approved' or 'Rejected'

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: `Appointment ${status}!`, appointment });

    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

module.exports = router;