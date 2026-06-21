const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Visitor = require('./models/Visitor');
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

app.get('/api/seed-database', async (req, res) => {
    try {
        await User.deleteMany();
        await Visitor.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            { name: 'System Admin', email: 'admin@office.com', password: hashedPassword, role: 'Admin' },
            { name: 'Front Desk Security', email: 'security@office.com', password: hashedPassword, role: 'Security' },
            { name: 'Ramesh (HR Employee)', email: 'ramesh@office.com', password: hashedPassword, role: 'Employee' }
        ];
        const createdUsers = await User.insertMany(users);
        const employee = createdUsers.find(u => u.role === 'Employee');

        const visitors = [
            { name: 'Rahul Sharma', email: 'rahul@test.com', phone: '9876543210', purposeOfVisit: 'Job Interview', hostId: employee._id, status: 'Approved' },
            { name: 'Priya Patel', email: 'priya@test.com', phone: '8765432109', purposeOfVisit: 'Vendor Meeting', hostId: employee._id, status: 'Pending' }
        ];
        await Visitor.insertMany(visitors);

        res.send('<h1 style="color: green; text-align: center; margin-top: 50px;">✅ Demo Visitors & Passes successfully seeded!</h1><p style="text-align: center;">You can close this tab and go to your registration page now.</p>');
    } catch (error) {
        res.status(500).send(`Error seeding database: ${error.message}`);
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log('Database connection failed:', error.message));