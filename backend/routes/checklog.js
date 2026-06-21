
const express = require('express');
const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();


router.post('/scan', verifyToken, async (req, res) => {
    try {
        const { passId, action } = req.body; 

        
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ message: 'Invalid Pass ID' });
        }

        
        if (new Date() > new Date(pass.validUntil)) {
            return res.status(400).json({ message: 'This pass has expired' });
        }

      
        const newLog = new CheckLog({
            passId: pass._id,
            scannedBy: req.user.id, 
            action: action
        });

        await newLog.save();

        if (action === 'Check-Out') {
            pass.status = 'Used';
            await pass.save();
        }

        res.status(201).json({ message: `Successfully logged ${action}`, log: newLog });

    } catch (error) {
        res.status(500).json({ message: 'Server error during scan', error: error.message });
    }
});

module.exports = router;