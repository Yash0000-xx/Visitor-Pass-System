
const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema({
    passId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pass', 
        required: true 
    },
    scannedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    action: { 
        type: String, 
        enum: ['Check-In', 'Check-Out'], 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('CheckLog', checkLogSchema);