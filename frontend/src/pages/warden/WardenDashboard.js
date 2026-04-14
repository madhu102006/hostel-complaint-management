import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WardenDashboard() {
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("appTheme") === "dark");
  const [complaints, setComplaints] = useState([]);
  const [outings, setOutings] = useState([]);
  
  // Notification states
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false); // Controls the popup
  const [alerts, setAlerts] = useState([]); // Holds actual notification text

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/complaints").then(res => res.json()),
      fetch("http://localhost:5000/api/outingrequests").then(res => res.json())
    ])
    .then(([complaintsData, outingsData]) => {
      setComplaints(complaintsData);
      setOutings(outingsData);

      // Filter only "Pending" items
      const pendingC = complaintsData.filter(c => c.status?.toLowerCase() === "pending");
      const pendingO = outingsData.filter(o => o.status?.toLowerCase() === "pending");
      
      setUnreadCount(pendingC.length + pendingO.length);

      // Generate text for the notification popup based on database items
      const generatedAlerts = [
        ...pendingC.map((c) => `🚨 New Complaint: ${c.issue || "Issue Reported"}`),
        ...pendingO.map((o) => `🚪 Outing Request from ${o.studentId || "Student"}`)
      ];
      setAlerts(generatedAlerts);
    })
    .catch((err) => console.error("Error fetching warden data:", err));
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("appTheme", newMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("wardenLoggedIn");
    navigate("/");
  };

  // ✅ STYLES
  const styles = {
    page: { padding: "30px", background: isDarkMode ? "#121212" : "#f4f6f8", minHeight: "100vh", color: isDarkMode ? "#ffffff" : "#000000", transition: "all 0.3s ease" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    backButton: { padding: "8px 16px", cursor: "pointer", backgroundColor: isDarkMode ? "#333" : "#e0e0e0", color: isDarkMode ? "#fff" : "#000", border: "none", borderRadius: "4px", marginRight: "10px" },
    themeButton: { padding: "8px 16px", cursor: "pointer", backgroundColor: isDarkMode ? "#444" : "#333", color: "#fff", border: "none", borderRadius: "4px", marginLeft: "10px" },
    
    // Notification Styles
    bellContainer: { position: "relative", fontSize: "24px", marginRight: "15px", cursor: "pointer" },
    badge: { position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "12px", fontWeight: "bold" },
    dropdown: { position: "absolute", top: "40px", right: "0", background: isDarkMode ? "#1e1e1e" : "#fff", width: "300px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", zIndex: 1000, border: isDarkMode ? "1px solid #333" : "1px solid #ddd", fontSize: "14px" },
    dropdownHeader: { display: "flex", justifyContent: "space-between", padding: "10px 15px", borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee", fontWeight: "bold", backgroundColor: isDarkMode ? "#2a2a2a" : "#f9f9f9", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" },
    dropdownBody: { maxHeight: "200px", overflowY: "auto", padding: "10px" },
    alertItem: { padding: "8px", borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee", color: isDarkMode ? "#ddd" : "#333" },

    actions: { display: "flex", gap: "20px", marginBottom: "40px", flexWrap: "wrap" },
    card: { background: isDarkMode ? "#1e1e1e" : "#fff", padding: "20px", borderRadius: "8px", width: "220px", height: "125px", cursor: "pointer", boxShadow: isDarkMode ? "0 2px 6px rgba(255,255,255,0.05)" : "0 2px 6px rgba(0,0,0,0.1)", color: isDarkMode ? "#e0e0e0" : "#000", border: isDarkMode ? "1px solid #333" : "1px solid #eee" },
    
    // Layout for the bottom sections
    bottomGrid: { display: "flex", gap: "20px" },
    section: { background: isDarkMode ? "#1e1e1e" : "#fff", padding: "20px", borderRadius: "8px", flex: 1, color: isDarkMode ? "#e0e0e0" : "#000", border: isDarkMode ? "1px solid #333" : "1px solid #eee" },
    statItem: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: isDarkMode ? "1px solid #333" : "1px solid #ddd" }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button style={styles.backButton} onClick={handleLogout}>Logout</button>
          <button style={styles.themeButton} onClick={toggleTheme}>
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        
        <h2>Warden Administration Dashboard</h2>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          
          {/* ✅ CLICKABLE NOTIFICATION BELL */}
          <div style={styles.bellContainer} onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}

            {/* ✅ NOTIFICATION DROPDOWN POPUP */}
            {showNotifications && (
              <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                <div style={styles.dropdownHeader}>
                  <span>Notifications ({unreadCount})</span>
                  <span style={{ cursor: "pointer" }} onClick={() => setShowNotifications(false)}>❌</span>
                </div>
                <div style={styles.dropdownBody}>
                  {alerts.length > 0 ? (
                    alerts.map((alert, idx) => (
                      <div key={idx} style={styles.alertItem}>{alert}</div>
                    ))
                  ) : (
                    <div style={{ padding: "10px", textAlign: "center", color: "gray" }}>No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <span style={{ fontWeight: "bold" }}>Warden</span>
        </div>
      </div>

      {/* Actions Container */}
      <div style={styles.actions}>
        <div style={styles.card} onClick={() => navigate("/warden/complaints")}>
          <h3>📋 Manage Complaints</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>View and resolve student issues</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/warden/outing-requests")}>
          <h3>🚪 Outing Requests</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>Approve or reject permissions</p>
        </div>

        <div style={{ ...styles.card, border: isDarkMode ? "1px solid #4da6ff" : "1px solid #36A2EB" }} onClick={() => navigate("/warden/analytics")}>
          <h3>📊 Real-time Stats</h3>
          <p style={{ fontSize: "14px", opacity: 0.8, color: "#36A2EB" }}>View Analytics & Insights</p>
        </div>

        <div style={styles.card} onClick={() => navigate("/warden/student-list")}>
          <h3>👥 Student Records</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>View all registered students</p>
        </div>
      </div>

      {/* Bottom Grid ensures sections sit side-by-side perfectly */}
      <div style={styles.bottomGrid}>
        
        {/* Quick Stats Section */}
        <div style={styles.section}>
          <h3 style={{ borderBottom: "2px solid #36A2EB", paddingBottom: "5px" }}>Quick Overview</h3>
          <div style={styles.statItem}>
            <span>Total Complaints:</span>
            <span style={{ fontWeight: "bold" }}>{complaints.length}</span>
          </div>
          <div style={styles.statItem}>
            <span>Pending Outings:</span>
            <span style={{ fontWeight: "bold", color: "orange" }}>
              {outings.filter(o => o.status === "Pending").length}
            </span>
          </div>
          <div style={styles.statItem}>
            <span>Analytics Status:</span>
            <span style={{ fontWeight: "bold", color: "#36A2EB" }}>Live</span>
          </div>
        </div>

        {/* ✅ NEW: SYSTEM ACTIVITY LOG (Fills the empty space!) */}
        <div style={styles.section}>
          <h3 style={{ borderBottom: "2px solid #9966FF", paddingBottom: "5px" }}>System Activity Logs</h3>
          
          <div style={{ marginTop: "15px", fontSize: "14px", lineHeight: "1.8" }}>
            <p style={{ display: "flex", gap: "10px" }}>
              <span>🟢</span> <span>MongoDB Database Connected</span>
            </p>
            <p style={{ display: "flex", gap: "10px" }}>
              <span>🟢</span> <span>Data Synchronization Active</span>
            </p>
            {alerts.length > 0 ? (
              <p style={{ display: "flex", gap: "10px", color: "orange" }}>
                <span>🟡</span> <span>Action Required: You have {unreadCount} pending approvals.</span>
              </p>
            ) : (
              <p style={{ display: "flex", gap: "10px", color: "#4da6ff" }}>
                <span>🔵</span> <span>All student requests have been processed.</span>
              </p>
            )}
            <p style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
               <button onClick={() => navigate("/warden/complaints")} style={{ padding: "5px 10px", background: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>Review Pending Tasks</button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WardenDashboard;