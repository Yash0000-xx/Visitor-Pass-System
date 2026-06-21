// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Security', 'Employee', 'Visitor'], // Restricts roles to these 4 exact words
        default: 'Visitor' 
    }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' dates

module.exports = mongoose.model('User', userSchema);