const mongoose = require("mongoose");

const OutingSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  reason: { type: String, required: true },
  outingDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  wardenResponse: { type: String }, // ✅ ADDED: To store rejection/approval reason
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Outing", OutingSchema);