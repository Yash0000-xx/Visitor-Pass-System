
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedDatabase = async () => {
    try {
       
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Database...');

        
        await User.deleteMany();
        console.log('Cleared old data...');

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

       
        const users = [
            { name: 'System Admin', email: 'admin@office.com', password: hashedPassword, role: 'Admin' },
            { name: 'Front Desk Security', email: 'security@office.com', password: hashedPassword, role: 'Security' },
            { name: 'Ramesh (HR Employee)', email: 'ramesh@office.com', password: hashedPassword, role: 'Employee' }
        ];

   
        await User.insertMany(users);
        console.log('Demo Users successfully seeded!');
        console.log('Login with: admin@office.com | Password: password123');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();