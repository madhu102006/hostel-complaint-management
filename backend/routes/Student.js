const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// 1. POST: Register a new student
router.post("/register", async (req, res) => {
  try {
    // Check if student already exists
    const existingStudent = await Student.findOne({ studentId: req.body.studentId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student ID already exists" });
    }

    const newStudent = new Student({
      studentId: req.body.studentId,
      password: req.body.password, // In a real app, you should hash this password
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      hostel: req.body.hostel,
      roomNumber: req.body.roomNumber,
      role: "Student" // Default role
    });

    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Login Route (Verify Password)
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // Find student by ID
    const student = await Student.findOne({ studentId: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if password matches
    if (student.password !== password) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // Success! Send back the student info
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. GET: Get Profile by Student ID (e.g., B23CS064)
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;