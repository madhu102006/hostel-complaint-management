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

// -------------------------------------------------------------------
// ✅ NEW ROUTE: Get outings for a specific student (For Gate Pass)
// MUST BE ABOVE "/:id" routes
// -------------------------------------------------------------------
router.get("/student/:studentId", async (req, res) => {
  try {
    const studentOutings = await Outing.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(studentOutings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. PUT: Update Status (Approve/Reject)
router.put("/:id", async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    
    // ✅ Save warden's response/reason if provided
    if (req.body.wardenResponse) {
      updateData.wardenResponse = req.body.wardenResponse;
    }

    const updatedOuting = await Outing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedOuting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;