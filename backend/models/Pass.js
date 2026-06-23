const mongoose = require('mongoose');

let visitorPassSchema = new mongoose.Schema({
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
        default: 'Active'
    },
    validUntil: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Pass', visitorPassSchema);