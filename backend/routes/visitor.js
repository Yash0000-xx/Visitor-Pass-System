const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const { name, email, phone, purposeOfVisit, hostId } = req.body;
        
       
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

        if (!name || !email || !phone || !purposeOfVisit || !hostId) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        const phoneDigits = phone.replace(/\D/g, ''); 
        if (phoneDigits.length < 10) {
            return res.status(400).json({ message: 'Phone number must be at least 10 digits.' });
        }

        const newVisitor = new Visitor({ 
            name, 
            email, 
            phone, 
            photoUrl, 
            purposeOfVisit, 
            hostId 
        });

        await newVisitor.save();
        res.status(201).json({ message: 'Visitor registered successfully!', visitor: newVisitor });

    } catch (error) {
        res.status(500).json({ message: 'Error registering visitor', error: error.message });
    }
});


router.get('/', verifyToken, checkRole(['Admin', 'Security']), async (req, res) => {
    try {
        const visitors = await Visitor.find().populate('hostId', 'name email'); 
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;