import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WardenDashboard() {
  const navigate = useNavigate();

  // Initialize theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("appTheme") === "dark";
  });

  // State for counts
  const [stats, setStats] = useState({
    pendingComplaints: 0,
    outingRequests: 0,
    totalStudents: 120, // Example default
    pendingActions: 0
  });

  // Fetch real stats from backend
  useEffect(() => {
    // Fetch Complaints Count
    fetch("http://localhost:5000/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        const pending = data.filter(c => c.status === "Pending").length;
        setStats(prev => ({ ...prev, pendingComplaints: pending }));
      })
      .catch(err => console.error("Error fetching complaints:", err));

    // Fetch Outing Requests Count (Assuming you have an endpoint)
    // fetch("http://localhost:5000/api/outings")... 
    
    // Fetch Students Count
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStats(prev => ({ ...prev, totalStudents: data.length }));
      })
      .catch(err => console.error("Error fetching students:", err));

  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("appTheme", newMode ? "dark" : "light");
  };

  // --- EXACT STYLES FROM STUDENT DASHBOARD ---
  const styles = {
    page: {
      padding: "30px",
      background: isDarkMode ? "#121212" : "#f4f6f8",
      minHeight: "100vh",
      color: isDarkMode ? "#ffffff" : "#000000",
      transition: "all 0.3s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    backButton: {
      padding: "8px 16px",
      cursor: "pointer",
      backgroundColor: isDarkMode ? "#333" : "#e0e0e0",
      color: isDarkMode ? "#fff" : "#000",
      border: "none",
      borderRadius: "4px",
      marginRight: "10px",
    },
    themeButton: {
      padding: "8px 16px",
      cursor: "pointer",
      backgroundColor: isDarkMode ? "#444" : "#333",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      marginLeft: "10px",
    },
    actions: {
      display: "flex",
      gap: "20px",
      marginBottom: "40px",
      flexWrap: "wrap",
    },
    card: {
      background: isDarkMode ? "#1e1e1e" : "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "240px", // Slightly wider to fit badges
      cursor: "pointer",
      boxShadow: isDarkMode ? "0 2px 6px rgba(255,255,255,0.05)" : "0 2px 6px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#e0e0e0" : "#000",
      transition: "background 0.3s ease",
      position: "relative", // For badge positioning
    },
    badge: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "#007bff", // Blue badge
      color: "white",
      borderRadius: "12px",
      padding: "2px 8px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    badgeRed: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "#dc3545", // Red badge for urgent items
      color: "white",
      borderRadius: "12px",
      padding: "2px 8px",
      fontSize: "12px",
      fontWeight: "bold",
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={styles.backButton} onClick={() => navigate("/")}>
            Logout
          </button>
          <button style={styles.themeButton} onClick={toggleTheme}>
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        
        <h2>Welcome to Warden Dashboard</h2>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>Warden</span>
        </div>
      </div>

      {/* Actions Container */}
      <div style={styles.actions}>
        
        {/* Pending Complaints */}
        <div style={styles.card} onClick={() => navigate("/warden/complaints")}>
          {stats.pendingComplaints > 0 && (
            <span style={styles.badgeRed}>{stats.pendingComplaints}</span>
          )}
          <h3>📢 Pending Complaints</h3>
          <p>Review and manage complaints</p>
        </div>

        {/* Outing Requests */}
        <div style={styles.card} onClick={() => navigate("/warden/outing-requests")}>
          {stats.outingRequests > 0 && (
            <span style={styles.badge}>{stats.outingRequests}</span>
          )}
          <h3>🚪 Outing Requests</h3>
          <p>Approve or reject requests</p>
        </div>

        {/* Total Students */}
        <div style={styles.card} onClick={() => navigate("/warden/students")}>
          <span style={{...styles.badge, background: isDarkMode ? "#333" : "#eee", color: isDarkMode ? "#fff" : "#000"}}>
            {stats.totalStudents}
          </span>
          <h3>👥 Total Students</h3>
          <p>View hostel strength</p>
        </div>

        {/* Pending Actions (Summary) */}
        <div style={styles.card}>
           {/* Just a summary card, maybe no link needed or link to a summary page */}
           <span style={styles.badge}>{stats.pendingComplaints + stats.outingRequests}</span>
          <h3>⚡ Pending Actions</h3>
          <p>Total tasks requiring attention</p>
        </div>

      </div>
    </div>
  );
}

export default WardenDashboard;