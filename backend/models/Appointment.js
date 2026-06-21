// backend/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    visitorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Visitor', // Links to the Visitor model we made earlier
        required: true 
    },
    hostId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Links to the Employee/Host
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' // All new requests start as pending
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);