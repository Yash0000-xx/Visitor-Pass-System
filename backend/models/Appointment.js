
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    visitorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Visitor', 
        required: true 
    },
    hostId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
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
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);