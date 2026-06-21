// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Used to encrypt passwords
const jwt = require('jsonwebtoken'); // Used to generate login tokens
const User = require('../models/User'); 

const router = express.Router();

// 1. REGISTER A NEW USER
router.post('/register', async (req, res) => {
    try {
        // Extract data from the request
        const { name, email, password, role } = req.body;

        // Check if the user already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Encrypt the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'Visitor' // If no role is provided, default to 'Visitor'
        });

        // Save to database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// 2. LOGIN USER
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the entered password matches the encrypted password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate the JWT Token (Your digital ID card)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, // The secret key from your .env file
            { expiresIn: '1d' } // Token expires in 24 hours
        );

        // Send the token and user details back to the frontend
        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;