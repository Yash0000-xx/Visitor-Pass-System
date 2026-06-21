// backend/routes/checklog.js
const express = require('express');
const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// SCAN QR CODE TO CHECK-IN OR CHECK-OUT
// We use verifyToken so only authorized security guards can scan passes
router.post('/scan', verifyToken, async (req, res) => {
    try {
        const { passId, action } = req.body; // action must be "Check-In" or "Check-Out"

        // 1. Verify the pass actually exists
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ message: 'Invalid Pass ID' });
        }

        // 2. Make sure the pass hasn't expired
        if (new Date() > new Date(pass.validUntil)) {
            return res.status(400).json({ message: 'This pass has expired' });
        }

        // 3. Create the log entry
        const newLog = new CheckLog({
            passId: pass._id,
            scannedBy: req.user.id, // We get this ID from the verifyToken middleware!
            action: action
        });

        await newLog.save();

        // 4. Update the Pass status if they check out
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