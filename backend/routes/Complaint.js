const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// 1. Create a new complaint
router.post("/", async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (error) {
    res.status(500).json({ message: "Error submitting complaint", error });
  }
});

// 2. Get ALL complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error });
  }
});

// ✅ Get counts of complaints by issue for the chart
router.get("/stats/categories", async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$issue", // Grouping by the 'issue' field
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// -------------------------------------------------------------------
// ✅ NEW ROUTE: Get complaints for a specific student (For Chart)
// MUST BE ABOVE "/:id"
// -------------------------------------------------------------------
router.get("/student/:studentId", async (req, res) => {
  try {
    // Find all complaints where the studentId matches the one in the URL
    const studentComplaints = await Complaint.find({ studentId: req.params.studentId });
    res.json(studentComplaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student complaints", error: err.message });
  }
});

// 3. Get SINGLE complaint by ID
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaint details", error });
  }
});

// 4. Update complaint status (Resolve/Reject)
router.put("/:id", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: status,
        ...(rejectionReason && { rejectionReason }) 
      },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: "Error updating complaint", error });
  }
});

module.exports = router;