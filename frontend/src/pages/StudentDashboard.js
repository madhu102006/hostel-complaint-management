import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  // Initialize state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("appTheme") === "dark";
  });
  
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch Complaints & Generate Notifications
  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        const myComplaints = data.filter((c) => c.studentId === studentId);
        
        const recent = myComplaints.slice(-3).reverse();
        setRecentComplaints(recent);

        const updates = myComplaints
          .filter(c => c.status && c.status.toLowerCase() !== "pending")
          .map(c => ({
            id: c._id,
            message: `Your complaint regarding '${c.issue || c.type}' has been ${c.status}.`,
            status: c.status,
            date: c.date || "Recently" 
          }))
          .reverse();

        setNotifications(updates);

        const lastViewedCount = parseInt(localStorage.getItem("lastViewedNotificationCount") || "0");
        const newUnread = Math.max(0, updates.length - lastViewedCount);
        setUnreadCount(newUnread);
      })
      .catch((err) => console.error("Error fetching complaints:", err));
  }, [studentId]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("appTheme", newMode ? "dark" : "light");
  };

  const handleBellClick = () => {
    if (!showNotifications) {
      setUnreadCount(0);
      localStorage.setItem("lastViewedNotificationCount", notifications.length.toString());
    }
    setShowNotifications(!showNotifications);
  };

  // Dynamic styles
  const styles = {
    page: {
      padding: "30px",
      background: isDarkMode ? "#121212" : "#f4f6f8",
      minHeight: "100vh",
      color: isDarkMode ? "#ffffff" : "#000000",
      transition: "all 0.3s ease",
      position: "relative",
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
    bellContainer: {
      position: "relative",
      cursor: "pointer",
      marginRight: "15px",
      fontSize: "24px",
      userSelect: "none",
    },
    badge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      background: "red",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    popup: {
      position: "absolute",
      top: "70px",
      right: "30px",
      width: "300px",
      background: isDarkMode ? "#1e1e1e" : "#fff",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: 1000,
      padding: "15px",
      display: showNotifications ? "block" : "none",
    },
    popupHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee",
      paddingBottom: "10px",
      marginBottom: "10px",
    },
    closeBtn: {
      cursor: "pointer",
      background: "transparent",
      border: "none",
      color: isDarkMode ? "#fff" : "#000",
      fontSize: "16px",
      fontWeight: "bold",
    },
    notifItem: {
      padding: "10px",
      borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee",
      fontSize: "14px",
    },
    actions: {
      display: "flex",
      gap: "20px",
      marginBottom: "40px",
      flexWrap: "wrap",
      alignItems: "flex-start", // Ensures items align to top
    },
    card: {
      background: isDarkMode ? "#1e1e1e" : "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "220px",
      cursor: "pointer",
      boxShadow: isDarkMode ? "0 2px 6px rgba(255,255,255,0.05)" : "0 2px 6px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#e0e0e0" : "#000",
      transition: "background 0.3s ease",
      height: "120px", // Fixed height to match alignment
    },
    section: {
      background: isDarkMode ? "#1e1e1e" : "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "400px", // Slightly reduced width to fit better
      color: isDarkMode ? "#e0e0e0" : "#000",
      transition: "background 0.3s ease",
      // Removed marginTop so it sits inline
    },
    complaint: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: isDarkMode ? "1px solid #333" : "1px solid #ddd",
    },
    pending: { color: "orange", fontWeight: "bold" },
    progress: { color: "#4da6ff", fontWeight: "bold" },
    resolved: { color: "green", fontWeight: "bold" },
    rejected: { color: "red", fontWeight: "bold" },
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return styles.pending;
    if (s === "in progress") return styles.progress;
    if (s === "resolved" || s === "approved") return styles.resolved;
    if (s === "rejected") return styles.rejected;
    return {};
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
        
        <h2>Welcome to Student Dashboard</h2>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={styles.bellContainer} onClick={handleBellClick}>
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
          </div>
          <span>Student</span>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotifications && (
        <div style={styles.popup}>
          <div style={styles.popupHeader}>
            <strong>Notifications</strong>
            <button style={styles.closeBtn} onClick={() => setShowNotifications(false)}>✕</button>
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#888" }}>No new updates.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={styles.notifItem}>
                  {n.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Actions Container - Now includes Recent Complaints */}
      <div style={styles.actions}>
        <div style={styles.card} onClick={() => navigate("/student/raise-complaint")}>
          <h3>📝 Raise Complaint</h3>
          <p>Report hostel related issues</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/student/my-complaints")}>
          <h3>📄 My Complaints</h3>
          <p>View status of submitted complaints</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/student/outing-permission")}>
          <h3>🚪 Outing Permission</h3>
          <p>Request permission to leave hostel</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/student/my-outings")}>
          <h3>📍 My Outings</h3>
          <p>Check status of requests</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/student/profile")}>
          <h3>👤 Profile</h3>
          <p>View student details</p>
        </div>

        {/* Recent Complaints - Moved INSIDE the flex container */}
        <div style={styles.section}>
          <h3>Recent Complaints</h3>

          {recentComplaints.length === 0 ? (
            <p style={{ color: isDarkMode ? "#aaa" : "#666" }}>
              No recent complaints found.
            </p>
          ) : (
            recentComplaints.map((c, index) => (
              <div key={index} style={styles.complaint}>
                <span>{c.issue || c.type}</span>
                <span style={getStatusStyle(c.status)}>{c.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;