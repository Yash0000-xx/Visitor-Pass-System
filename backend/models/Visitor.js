const mongoose = require('mongoose');

let visSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String
    },
    purposeOfVisit: {
        type: String,
        required: true
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Pending'
    },
    otp: {
        type: String,
        default: null
    },
    isAppointment: {
        type: Boolean,
        default: false
    },
    appointmentDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visSchema);