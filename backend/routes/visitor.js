const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const sendEmail = require('../utils/sendEmail'); 

router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const { name, email, phone, purposeOfVisit, hostId } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'A visitor photo is strictly required.' });
        }
        
        const photoUrl = `/uploads/${req.file.filename}`;

        if (!name || !email || !phone || !purposeOfVisit || !hostId) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newVisitor = new Visitor({ 
            name, email, phone, photoUrl, purposeOfVisit, hostId,
            otp: otp, 
            status: 'Pending' 
        });

        await newVisitor.save();
        
        await sendEmail(email, "Visitor Registration OTP", `Your verification code is: ${otp}`);

        res.status(201).json({ message: 'Visitor registered! Please check email for OTP.', visitorId: newVisitor._id });

    } catch (error) {
        res.status(500).json({ message: 'Error registering visitor', error: error.message });
    }
});


router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const visitor = await Visitor.findOne({ email });

        // Safety check in case the email doesn't exist
        if (!visitor) {
            return res.status(404).json({ message: 'Visitor not found.' });
        }

        // FIXED: Added the opening bracket '{' that was missing here
        if (String(visitor.otp) !== String(req.body.otp)) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        visitor.status = 'Approved';
        visitor.otp = null; 
        await visitor.save();

        res.json({ message: 'OTP Verified! Visitor Approved.' });
    } catch (error) {
        // Added error logging so we can see if anything else breaks
        console.error("Verification Error:", error);
        res.status(500).json({ message: 'Server error during verification.', error: error.message });
    }
});


router.get('/', verifyToken, checkRole(['Admin', 'Security']), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const visitors = await Visitor.find()
            .populate('hostId', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Visitor.countDocuments();

        res.status(200).json({
            visitors,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalVisitors: total
        });
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

router.put('/:id/status', verifyToken, checkRole(['Employee', 'Admin']), async (req, res) => {
    try {
        const { status } = req.body;
        const visitor = await Visitor.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );

        if (status === 'Approved') {
            await sendEmail(visitor.email, "Visit Approved", `Hello ${visitor.name}, your visit has been approved!`);
        }

        res.json({ message: `Pass ${status.toLowerCase()}!`, visitor });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

module.exports = router;