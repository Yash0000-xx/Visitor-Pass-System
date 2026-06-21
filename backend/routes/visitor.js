// backend/routes/visitor.js
const express = require('express');
const Visitor = require('../models/Visitor');
const { verifyToken } = require('../middleware/auth'); // Security bouncer

const router = express.Router();

// 1. REGISTER A NEW VISITOR (With Input Validation to satisfy Mentor Requirement #8)
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, photoUrl, purposeOfVisit, hostId } = req.body;
        
        // --- INPUT VALIDATION LOGIC ---
        // 1. Check for missing required fields
        if (!name || !email || !phone || !purposeOfVisit || !hostId) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        // 2. Validate Email Format using Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        // 3. Validate Phone Number (Basic check for at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, ''); // Strips out dashes/spaces to just count numbers
        if (phoneDigits.length < 10) {
            return res.status(400).json({ message: 'Phone number must be at least 10 digits.' });
        }
        // ------------------------------

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

// 2. GET ALL VISITORS (Protected: Only logged-in Admins/Security can see this list)
router.get('/', verifyToken, async (req, res) => { 
    try {
        const visitors = await Visitor.find().populate('hostId', 'name email'); 
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;