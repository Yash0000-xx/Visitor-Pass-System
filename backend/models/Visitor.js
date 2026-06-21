// backend/models/Visitor.js
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
        type: String // We will save the image URL or base64 string here later
    },
    purposeOfVisit: { 
        type: String, 
        required: true 
    },
    hostId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // This links the visitor to the specific Employee they are visiting
    }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);