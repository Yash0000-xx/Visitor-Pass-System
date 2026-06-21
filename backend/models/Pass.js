
const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    appointmentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment', 
        required: true 
    },
    qrCodeData: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Used', 'Expired'], 
        default: 'Active' 
    },
    validUntil: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Pass', passSchema);