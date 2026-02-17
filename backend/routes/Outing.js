const express = require("express");
const router = express.Router();
const Outing = require("../models/Outing");

// 1. POST: Create a new Outing Request (Student)
router.post("/", async (req, res) => {
  try {
    const newOuting = new Outing({
      studentId: req.body.studentId,
      reason: req.body.reason,
      outingDate: req.body.outing_date, // Make sure frontend sends 'outing_date'
      returnDate: req.body.return_date, // Make sure frontend sends 'return_date'
    });

    const savedOuting = await newOuting.save();
    res.status(201).json(savedOuting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET: Get ALL Outing Requests (Warden)
router.get("/", async (req, res) => {
  try {
    const outings = await Outing.find().sort({ createdAt: -1 });
    res.json(outings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. PUT: Update Status (Approve/Reject)
router.put("/:id", async (req, res) => {
  try {
    const updatedOuting = await Outing.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOuting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;