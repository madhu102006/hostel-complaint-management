const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    roomNumber: String,
    phoneNumber: String,
    issue: String,
    description: String,
    studentId: String,
    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
