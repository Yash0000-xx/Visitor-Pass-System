
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitors', require('./routes/visitor'));
app.use('/api/appointments', require('./routes/appointment'));
app.use('/api/passes', require('./routes/pass'));
app.use('/api/checklog', require('./routes/checklog'));

app.get('/', (req, res) => {
    res.send('Visitor Pass Management API is running...');
});
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log('Database connection failed:', error.message));