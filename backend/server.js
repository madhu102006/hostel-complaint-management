const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/hostelDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ROUTES
app.use("/api/Complaints", require("./routes/Complaint"));
app.use("/api/students", require("./routes/Student")); 
app.use("/api/outingrequests", require("./routes/Outing"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});