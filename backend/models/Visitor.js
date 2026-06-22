const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
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
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending' 
    },
    // THIS IS THE FIX: Telling Mongoose to stop deleting the OTP
    otp: { 
        type: String, 
        default: null 
    }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);