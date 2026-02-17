import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyComplaints() {
  const navigate = useNavigate();

  // Check the saved theme setting
  const isDarkMode = localStorage.getItem("appTheme") === "dark";
  
  // Get the logged-in student's ID
  const studentId = localStorage.getItem("studentId");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch complaints from backend
    fetch("http://localhost:5000/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        // Filter complaints to show ONLY this student's complaints
        // Assuming the backend returns an array of complaints and each has a 'studentId' field
        const myComplaints = data.filter(c => c.studentId === studentId);
        setComplaints(myComplaints);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching complaints:", err);
        setLoading(false);
      });
  }, [studentId]);

  // Dynamic Styles based on theme
  const styles = {
    page: {
      padding: "30px",
      background: isDarkMode ? "#121212" : "#f4f6f8",
      minHeight: "100vh",
      color: isDarkMode ? "#e0e0e0" : "#000",
      transition: "background 0.3s, color 0.3s",
    },
    back: {
      cursor: "pointer",
      color: isDarkMode ? "#90caf9" : "#1976d2",
      marginBottom: "15px",
      fontWeight: "bold",
      display: "inline-block",
    },
    card: {
      background: isDarkMode ? "#1e1e1e" : "#fff",
      padding: "15px",
      marginBottom: "15px",
      borderRadius: "8px",
      boxShadow: isDarkMode ? "0 2px 5px rgba(255,255,255,0.05)" : "0 2px 5px rgba(0,0,0,0.1)",
      border: isDarkMode ? "1px solid #333" : "none",
    },
    heading: {
      color: isDarkMode ? "#fff" : "#333",
    }
  };

  // Helper for status colors
  const getStatusStyle = (status) => {
    if (status === "Pending") return { color: "orange", fontWeight: "bold" };
    if (status === "In Progress") return { color: isDarkMode ? "#4da6ff" : "blue", fontWeight: "bold" };
    return { color: isDarkMode ? "#66bb6a" : "green", fontWeight: "bold" };
  };

  return (
    <div style={styles.page}>
      {/* Back */}
      <div style={styles.back} onClick={() => navigate("/student/dashboard")}>
        ← Back
      </div>

      <h2 style={styles.heading}>My Complaints</h2>
      
      {/* Show logged in ID for confirmation (Optional) */}
      <p style={{ fontSize: "14px", color: isDarkMode ? "#888" : "#666", marginBottom: "20px" }}>
        Showing complaints for Roll No: <strong>{studentId || "Guest"}</strong>
      </p>

      {loading ? (
        <p>Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints found for this Roll Number.</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id || c.id} style={styles.card}>
            <h4>Type: {c.issue || c.type}</h4>
            <p><strong>Description:</strong> {c.description}</p>
            <p><strong>Room:</strong> {c.roomNumber}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={getStatusStyle(c.status)}>{c.status}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyComplaints;