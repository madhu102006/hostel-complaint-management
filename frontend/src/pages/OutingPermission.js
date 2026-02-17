import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OutingPermission() {
  const navigate = useNavigate();

  // Check theme setting
  const isDarkMode = localStorage.getItem("appTheme") === "dark";
  
  // Get logged-in Student ID
  const loggedInStudentId = localStorage.getItem("studentId");

  const [form, setForm] = useState({
    studentId: loggedInStudentId || "",
    reason: "",
    outingDate: "",
    returnDate: "",
  });

  const [message, setMessage] = useState("");

  // Ensure ID is set even if page refreshes
  useEffect(() => {
    if (loggedInStudentId) {
      setForm((prev) => ({ ...prev, studentId: loggedInStudentId }));
    }
  }, [loggedInStudentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.reason || !form.outingDate || !form.returnDate) {
      setMessage("Please fill all fields!");
      return;
    }

    try {
      // Send data to backend
      // Note: We send 'studentId' now!
      await axios.post("http://localhost:5000/api/outingrequests", {
        studentId: form.studentId,
        reason: form.reason,
        outing_date: form.outingDate,
        return_date: form.returnDate,
      });

      alert("Outing Request Submitted Successfully");
      navigate("/student/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
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
      width: "400px",
      borderRadius: "8px",
      position: "relative",
      boxShadow: isDarkMode ? "0 4px 10px rgba(255,255,255,0.05)" : "0 4px 10px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#fff" : "#000",
    },
    back: {
      cursor: "pointer",
      color: isDarkMode ? "#90caf9" : "#1976d2",
      marginBottom: "15px",
      fontWeight: "bold",
      display: "inline-block",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "8px 0 15px 0",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      borderRadius: "4px",
    },
    textarea: {
      width: "100%",
      height: "100px",
      padding: "8px",
      marginBottom: "15px",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      borderRadius: "4px",
    },
    label: {
      fontWeight: "bold",
      display: "block",
      marginBottom: "5px",
      color: isDarkMode ? "#ccc" : "#000",
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
    message: {
      color: "red",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        {/* 🔙 Back Navigation */}
        <div style={styles.back} onClick={() => navigate("/student/dashboard")}>
          ← Back
        </div>

        <h2>Outing Permission</h2>

        <textarea
          name="reason"
          placeholder="Write your outing request like a formal letter..."
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <label style={styles.label}>Outing Date & Time</label>
        <input
          type="datetime-local"
          name="outingDate"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Expected Return</label>
        <input
          type="datetime-local"
          name="returnDate"
          onChange={handleChange}
          style={styles.input}
          required
        />

        {message && <p style={styles.message}>{message}</p>}

        <button type="submit" style={styles.button}>
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default OutingPermission;