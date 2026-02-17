import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RaiseComplaint() {
  const navigate = useNavigate();

  // Check theme setting
  const isDarkMode = localStorage.getItem("appTheme") === "dark";
  
  // Get logged-in Student ID
  const loggedInStudentId = localStorage.getItem("studentId");

  const [form, setForm] = useState({
    rollNumber: loggedInStudentId || "", // Auto-fill Roll No
    roomNumber: "",
    phoneNumber: "",
    complaintType: "",
    description: "",
  });

  // If the user refreshes, make sure we still have the ID
  useEffect(() => {
    if (loggedInStudentId) {
      setForm((prev) => ({ ...prev, rollNumber: loggedInStudentId }));
    }
  }, [loggedInStudentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: form.rollNumber, // Uses the auto-filled ID
          roomNumber: form.roomNumber,
          phoneNumber: form.phoneNumber,
          issue: form.complaintType,
          description: form.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      alert("Complaint Raised Successfully");
      navigate("/student/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error submitting complaint");
    }
  };

  // Dynamic Styles
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: isDarkMode ? "#121212" : "#f2f2f2",
      transition: "background 0.3s",
    },
    card: {
      background: isDarkMode ? "#1e1e1e" : "#fff",
      padding: "25px",
      width: "350px",
      borderRadius: "8px",
      position: "relative",
      boxShadow: isDarkMode ? "0 4px 10px rgba(255,255,255,0.05)" : "0 4px 10px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#fff" : "#000",
    },
    back: {
      cursor: "pointer",
      color: isDarkMode ? "#90caf9" : "#1976d2",
      marginBottom: "10px",
      fontWeight: "bold",
      display: "inline-block",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "8px 0",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      borderRadius: "4px",
    },
    textarea: {
      width: "100%",
      height: "80px",
      margin: "8px 0",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      borderRadius: "4px",
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "#1976d2",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      marginTop: "10px",
      borderRadius: "4px",
    },
    readOnlyInput: {
      width: "100%",
      padding: "8px",
      margin: "8px 0",
      background: isDarkMode ? "#2c2c2c" : "#e9ecef", // Greyed out
      color: isDarkMode ? "#aaa" : "#555",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      borderRadius: "4px",
      cursor: "not-allowed",
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        {/* 🔙 Back Navigation */}
        <div
          style={styles.back}
          onClick={() => navigate("/student/dashboard")}
        >
          ← Back
        </div>

        <h2>Raise Complaint</h2>

        {/* Read-Only Roll Number Field */}
        <label style={{fontSize: "12px", fontWeight: "bold"}}>Roll Number</label>
        <input
          name="rollNumber"
          value={form.rollNumber}
          readOnly // User cannot change this
          style={styles.readOnlyInput} 
        />

        <input
          name="roomNumber"
          placeholder="Room Number"
          value={form.roomNumber}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <select
          name="complaintType"
          value={form.complaintType}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Complaint Type</option>
          <option>Water</option>
          <option>Electricity</option>
          <option>Cleanliness</option>
          <option>Food</option>
          <option>Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe the problem"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.button}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default RaiseComplaint;