const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const sendSMS = require('../utils/sendSMS');
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

router.get('/employees', async (req, res) => {
    try {
        const employees = await User.find({ role: 'Employee' }).select('name _id');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

router.get('/my-visitors', verifyToken, checkRole(['Employee']), async (req, res) => {
    try {
        const visitors = await Visitor.find({ hostId: req.user.id });
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your visitors' });
    }
});

router.put('/:id/status', verifyToken, checkRole(['Employee', 'Admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );

     
        if (status === 'Approved' && visitor.phone) {
            const message = `Hello ${visitor.name}, your visit has been approved! Show your ID at the front desk.`;
            await sendSMS(visitor.phone, message);
        }

        res.json({ message: `Pass ${status.toLowerCase()}!`, visitor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

module.exports = router;