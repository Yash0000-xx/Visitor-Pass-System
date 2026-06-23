const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

async function seedDB() {
    try {
        await User.deleteMany({});
        
        let mySalt = await bcrypt.genSalt(10);
        let securePass = await bcrypt.hash("password123", mySalt);

        let myAdmin = new User({
            name: "Admin Person",
            email: "admin@test.com",
            password: securePass,
            role: "Admin"
        });
        
        let myEmployee = new User({
            name: "John Employee",
            email: "john@test.com",
            password: securePass,
            role: "Employee"
        });

        await myAdmin.save();
        await myEmployee.save();
        
        console.log("Dummy users added to the database");
        process.exit(0);
    } catch (err) {
        console.log("Seeding failed");
        console.log(err);
        process.exit(1);
    }
}

seedDB();