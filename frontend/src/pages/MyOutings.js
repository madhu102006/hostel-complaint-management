import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyOutings() {
  const navigate = useNavigate();

  // Check theme and user ID
  const isDarkMode = localStorage.getItem("appTheme") === "dark";
  const studentId = localStorage.getItem("studentId");

  const [outings, setOutings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all outings
    fetch("http://localhost:5000/api/outingrequests")
      .then((res) => res.json())
      .then((data) => {
        // Filter to show ONLY this student's outings
        const myOutings = data.filter((o) => o.studentId === studentId);
        setOutings(myOutings);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching outings:", err);
        setLoading(false);
      });
  }, [studentId]);

  // Dynamic Styles
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
      padding: "20px",
      marginBottom: "15px",
      borderRadius: "8px",
      boxShadow: isDarkMode ? "0 2px 5px rgba(255,255,255,0.05)" : "0 2px 5px rgba(0,0,0,0.1)",
      border: isDarkMode ? "1px solid #333" : "none",
    },
    status: (status) => ({
      fontWeight: "bold",
      color: status === "Approved" ? (isDarkMode ? "#66bb6a" : "green") 
           : status === "Rejected" ? (isDarkMode ? "#ef5350" : "red") 
           : "orange",
    }),
  };

  return (
    <div style={styles.page}>
      <div style={styles.back} onClick={() => navigate("/student/dashboard")}>
        ← Back
      </div>

      <h2>My Outing Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : outings.length === 0 ? (
        <p>No outing requests found.</p>
      ) : (
        outings.map((o) => (
          <div key={o._id} style={styles.card}>
            <p><strong>Reason:</strong> {o.reason}</p>
            <p><strong>From:</strong> {new Date(o.outingDate).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(o.returnDate).toLocaleString()}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={styles.status(o.status)}>{o.status}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOutings;