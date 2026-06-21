const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Visitor = require('./models/Visitor'); 

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        await User.deleteMany();
        await Visitor.deleteMany(); 
        console.log('Cleared old data...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            { name: 'System Admin', email: 'admin@office.com', password: hashedPassword, role: 'Admin' },
            { name: 'Front Desk Security', email: 'security@office.com', password: hashedPassword, role: 'Security' },
            { name: 'Ramesh (HR Employee)', email: 'ramesh@office.com', password: hashedPassword, role: 'Employee' }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Demo Users seeded!');

        
        const employee = createdUsers.find(u => u.role === 'Employee');

        const visitors = [
            {
                name: 'Rahul Sharma',
                email: 'rahul@test.com',
                phone: '9876543210',
                purposeOfVisit: 'Job Interview',
                hostId: employee._id,
                status: 'Approved' 
            },
            {
                name: 'Priya Patel',
                email: 'priya@test.com',
                phone: '8765432109',
                purposeOfVisit: 'Vendor Meeting',
                hostId: employee._id,
                status: 'Pending' 
            }
        ];

        await Visitor.insertMany(visitors);
        console.log('Demo Visitors & Passes successfully seeded!');
        console.log('Login with: admin@office.com | Password: password123');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();