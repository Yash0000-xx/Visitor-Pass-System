// backend/routes/visitor.js
const express = require('express');
const Visitor = require('../models/Visitor');
const router = express.Router();

// 1. REGISTER A NEW VISITOR
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, photoUrl, purposeOfVisit, hostId } = req.body;
        
        const newVisitor = new Visitor({ 
            name, 
            email, 
            phone, 
            photoUrl, // We will pass the image data as a string here later
            purposeOfVisit, 
            hostId 
        });

        await newVisitor.save();
        res.status(201).json({ message: 'Visitor registered successfully!', visitor: newVisitor });

    } catch (error) {
        res.status(500).json({ message: 'Error registering visitor', error: error.message });
    }
});

// 2. GET ALL VISITORS (For the Admin Dashboard later)
router.get('/', async (req, res) => {
    try {
        const visitors = await Visitor.find().populate('hostId', 'name email'); 
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;