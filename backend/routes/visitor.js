const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const axios = require('axios');
const upload = require('../middleware/upload');
const { verifyToken, checkRole } = require('../middleware/auth');

router.post('/register', upload.single('photo'), async (req, res) => {
    let reqBody = req.body;

    if (!reqBody.name || !reqBody.email || !reqBody.phone || !reqBody.purposeOfVisit) {
        return res.status(400).json({ error: "Missing required form data" });
    }

    if (reqBody.phone.length !== 10) {
        return res.status(400).json({ error: "Phone number must be 10 digits" });
    }

    if (!reqBody.email.includes('@')) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    let generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    let picturePath = "";
    if (req.file) {
        picturePath = '/uploads/' + req.file.filename;
    }

    try {
        let newVis = new Visitor({
            name: reqBody.name,
            email: reqBody.email,
            phone: reqBody.phone,
            photoUrl: picturePath,
            purposeOfVisit: reqBody.purposeOfVisit,
            hostId: reqBody.hostId,
            otp: generatedOtp,
            status: 'Pending',
            isAppointment: reqBody.isAppointment || false,
            appointmentDate: reqBody.appointmentDate || null
        });

        await newVis.save();

        let mailPayload = {
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: {
                to_email: reqBody.email,
                subject: "Visitor Verification Code",
                message: generatedOtp
            }
        };

        await axios.post('https://api.emailjs.com/api/v1.0/email/send', mailPayload);

        res.status(201).json({ 
            msg: "Registration successful. Check email for code.", 
            id: newVis._id 
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Database or email failure" });
    }
});

router.post('/verify-otp', async (req, res) => {
    let inputEmail = req.body.email;
    let inputOtp = req.body.otp;

    if (!inputEmail || !inputOtp) {
        return res.status(400).json({ error: "Missing email or OTP" });
    }

    try {
        let foundVis = await Visitor.findOne({ email: inputEmail }).sort({ createdAt: -1 });

        if (!foundVis) {
            return res.status(404).json({ error: "No visitor found" });
        }

        if (foundVis.otp !== inputOtp) {
            return res.status(400).json({ error: "Wrong OTP" });
        }

        foundVis.status = 'Approved';
        foundVis.otp = null;
        await foundVis.save();

        res.json({ msg: "Verified and approved!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server crashed" });
    }
});

router.get('/appointments', async (req, res) => {
    try {
        let pendingApps = await Visitor.find({ 
            isAppointment: true, 
            status: 'Pending' 
        }).populate('hostId', 'name email');
        
        res.json(pendingApps);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to get appointments" });
    }
});

router.get('/', verifyToken, checkRole(['Admin', 'Security']), async (req, res) => {
    try {
        let pageNum = parseInt(req.query.page) || 1;
        let limitNum = parseInt(req.query.limit) || 10;
        let skipNum = (pageNum - 1) * limitNum;

        let allVisitors = await Visitor.find()
            .populate('hostId', 'name email')
            .skip(skipNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        let totalCount = await Visitor.countDocuments();

        res.status(200).json({
            visitors: allVisitors,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalVisitors: totalCount
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to load visitors" });
    }
});

router.get('/employees', async (req, res) => {
    try {
        let empList = await User.find({ role: 'Employee' }).select('name _id');
        res.json(empList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Could not fetch employee list" });
    }
});

router.put('/:id/status', verifyToken, checkRole(['Employee', 'Admin']), async (req, res) => {
    let updateStatus = req.body.status;

    try {
        let updatedVis = await Visitor.findByIdAndUpdate(
            req.params.id, 
            { status: updateStatus }, 
            { new: true }
        );

        if (updateStatus === 'Approved') {
            try {
                let mailPayload = {
                    service_id: process.env.EMAILJS_SERVICE_ID,
                    template_id: process.env.EMAILJS_TEMPLATE_ID,
                    user_id: process.env.EMAILJS_PUBLIC_KEY,
                    accessToken: process.env.EMAILJS_PRIVATE_KEY,
                    template_params: {
                        to_email: updatedVis.email,
                        subject: "Visit Approved",
                        message: "Your visit has been approved!"
                    }
                };
                await axios.post('https://api.emailjs.com/api/v1.0/email/send', mailPayload);
            } catch (mailErr) {
                console.log("Email failed but status updated");
            }
        }

        res.json({ msg: "Status updated to " + updateStatus, visitor: updatedVis });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update visitor status" });
    }
});

module.exports = router;