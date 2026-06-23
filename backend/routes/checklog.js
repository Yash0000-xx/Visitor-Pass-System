const express = require('express');
const CheckLog = require('../models/checklog');
const Pass = require('../models/Pass');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/scan', verifyToken, async (req, res) => {
    let scannedPassId = req.body.passId;
    let scanAction = req.body.action;

    if (!scannedPassId || !scanAction) {
        return res.status(400).json({ error: "Missing pass ID or scan action" });
    }

    if (scanAction !== 'Check-In' && scanAction !== 'Check-Out') {
        return res.status(400).json({ error: "Action must be exactly Check-In or Check-Out" });
    }

    try {
        let foundPass = await Pass.findById(scannedPassId);
        
        if (!foundPass) {
            return res.status(404).json({ error: "Could not find this pass in the system" });
        }

        let rightNow = new Date();
        let passExpiration = new Date(foundPass.validUntil);

        if (rightNow > passExpiration) {
            return res.status(400).json({ error: "This pass has already expired" });
        }

        let newScanLog = new CheckLog({
            passId: foundPass._id,
            scannedBy: req.user.id,
            action: scanAction
        });

        await newScanLog.save();

        if (scanAction === 'Check-Out') {
            foundPass.status = 'Used';
            await foundPass.save();
        }

        res.status(201).json({ msg: "Scan recorded successfully", logData: newScanLog });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something broke while scanning the pass" });
    }
});

module.exports = router;