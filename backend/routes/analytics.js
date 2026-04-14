// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

router.get('/complaint-stats', async (req, res) => {
    try {
        const stats = await Complaint.aggregate([
            {
                $group: {
                    _id: "$category", // Assuming you have a 'category' field (Electrical, Plumbing, etc.)
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;