const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    let reqData = req.body;

    if (!reqData.email || !reqData.password || !reqData.name) {
        return res.status(400).json({ error: "Please fill out all required fields" });
    }

    try {
        let checkUser = await User.findOne({ email: reqData.email });
        
        if (checkUser) {
            return res.status(400).json({ error: "That email is already registered" });
        }

        let mySalt = await bcrypt.genSalt(10);
        let securePassword = await bcrypt.hash(reqData.password, mySalt);

        let chosenRole = reqData.role;
        if (!chosenRole) {
            chosenRole = 'Employee';
        }

        let newUserObj = new User({
            name: reqData.name,
            email: reqData.email,
            password: securePassword,
            role: chosenRole
        });

        await newUserObj.save();
        res.status(201).json({ msg: "Account created successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong during registration" });
    }
});

router.post('/login', async (req, res) => {
    let emailInput = req.body.email;
    let passInput = req.body.password;

    if (!emailInput || !passInput) {
        return res.status(400).json({ error: "Email and password are required to login" });
    }

    try {
        let foundUser = await User.findOne({ email: emailInput });
        
        if (!foundUser) {
            return res.status(400).json({ error: "Wrong email or password" });
        }

        let passMatch = await bcrypt.compare(passInput, foundUser.password);
        
        if (!passMatch) {
            return res.status(400).json({ error: "Wrong email or password" });
        }

        let payload = {
            id: foundUser._id,
            role: foundUser.role
        };

        let myToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            msg: "Logged in successfully",
            token: myToken,
            userData: {
                id: foundUser._id,
                name: foundUser.name,
                role: foundUser.role
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error during login" });
    }
});

module.exports = router;