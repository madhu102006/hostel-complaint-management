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

// 3. Get SINGLE complaint by ID (This was missing!)
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

// 4. Update complaint status (Resolve/Reject) (This was also missing!)
router.put("/:id", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    // Find and update the complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: status,
        // Only save rejection reason if it exists
        ...(rejectionReason && { rejectionReason }) 
      },
      { new: true } // Return the updated document
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