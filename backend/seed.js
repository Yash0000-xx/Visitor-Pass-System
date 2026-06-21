// backend/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        // Clear existing users to avoid duplicates
        await User.deleteMany();
        console.log('Cleared old data...');

        // Create a hashed password for everyone
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create dummy users
        const users = [
            { name: 'System Admin', email: 'admin@office.com', password: hashedPassword, role: 'Admin' },
            { name: 'Front Desk Security', email: 'security@office.com', password: hashedPassword, role: 'Security' },
            { name: 'Ramesh (HR Employee)', email: 'ramesh@office.com', password: hashedPassword, role: 'Employee' }
        ];

        // Insert into database
        await User.insertMany(users);
        console.log('Demo Users successfully seeded!');
        console.log('Login with: admin@office.com | Password: password123');

        // Exit the script
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();