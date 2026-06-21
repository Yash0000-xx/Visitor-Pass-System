// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));// Allows your app to read JSON data

// Basic Route to test if it's working
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitors', require('./routes/visitor'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/passes', require('./routes/pass')); // <-- ADD THIS LINE
app.use('/api/checklog', require('./routes/checklog'));
app.get('/', (req, res) => {
    res.send('Visitor Pass Management API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log('Database connection failed:', error.message));