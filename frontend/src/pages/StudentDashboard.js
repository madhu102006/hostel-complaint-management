import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import QRCode from "react-qr-code";

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

function StudentDashboard() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("appTheme") === "dark");
  const [studentName, setStudentName] = useState("Student");
  
  // Data states
  const [complaints, setComplaints] = useState([]);
  const [outings, setOutings] = useState([]);

  useEffect(() => {
    // Get student details from localStorage (adapt based on how you store login info)
    const storedName = localStorage.getItem("studentName") || "Vemulapally Madhusri";
    const studentId = localStorage.getItem("studentId");
    setStudentName(storedName);

    // Fetch student's specific complaints and outings
    // NOTE: Update these endpoints if your backend routes are different!
    if (studentId) {
      fetch(`http://localhost:5000/api/complaints/student/${studentId}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setComplaints(data || []))
        .catch(err => console.error(err));

      fetch(`http://localhost:5000/api/outingrequests/student/${studentId}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => setOutings(data || []))
        .catch(err => console.error(err));
    } else {
      // DUMMY DATA for layout testing if backend isn't connected yet
      setComplaints([
        { issue: "Water", status: "Rejected" },
        { issue: "Electricity", status: "Pending" },
        { issue: "Cleaning", status: "Resolved" }
      ]);
      setOutings([
        { reason: "Going Home", status: "Approved", date: "2026-04-15", id: "OUT-12345" }
      ]);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("appTheme", newMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // --- CHART DATA CALCULATIONS ---
  const resolvedCount = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
  const pendingCount = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
  const rejectedCount = complaints.filter(c => c.status?.toLowerCase() === "rejected").length;

  const chartData = {
    labels: ["Resolved", "Pending", "Rejected"],
    datasets: [
      {
        data: [resolvedCount, pendingCount, rejectedCount],
        backgroundColor: ["#4BC0C0", "#FFCE56", "#FF6384"], // Green, Yellow, Red
        hoverOffset: 4,
        borderWidth: 0
      }
    ]
  };

  // --- GATE PASS LOGIC ---
  // Find the most recent APPROVED outing
  const activeGatePass = outings.find(o => o.status?.toLowerCase() === "approved");

  // STYLES matching your screenshot
  const styles = {
    page: { padding: "30px", background: isDarkMode ? "#121212" : "#f4f6f8", minHeight: "100vh", color: isDarkMode ? "#ffffff" : "#000000", fontFamily: "sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
    btn: { padding: "8px 16px", cursor: "pointer", backgroundColor: isDarkMode ? "#333" : "#e0e0e0", color: isDarkMode ? "#fff" : "#000", border: "none", borderRadius: "4px", marginRight: "10px" },
    themeBtn: { padding: "8px 16px", cursor: "pointer", backgroundColor: isDarkMode ? "#444" : "#333", color: "#fff", border: "none", borderRadius: "4px" },
    actions: { display: "flex", gap: "20px", marginBottom: "40px", flexWrap: "wrap" },
    card: { background: isDarkMode ? "#1e1e1e" : "#fff", padding: "20px", borderRadius: "8px", width: "220px", height: "120px", cursor: "pointer", border: isDarkMode ? "1px solid #333" : "1px solid #eee", transition: "0.3s" },
    bottomGrid: { display: "flex", gap: "20px" },
    box: { background: isDarkMode ? "#1e1e1e" : "#fff", padding: "20px", borderRadius: "8px", flex: 1, border: isDarkMode ? "1px solid #333" : "1px solid #eee", minHeight: "250px" }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <button style={styles.btn} onClick={handleLogout}>Logout</button>
          <button style={styles.themeBtn} onClick={toggleTheme}>{isDarkMode ? "☀️ Light" : "🌙 Dark"}</button>
        </div>
        <h2 style={{ margin: 0 }}>Welcome, {studentName}! 👋</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "20px", cursor: "pointer" }}>🔔</span>
          <Link to="/student/profile" style={{ color: "#4da6ff", textDecoration: "none", fontWeight: "bold" }}>👤 Profile</Link>
        </div>
      </div>

      {/* Main Action Cards */}
      <div style={styles.actions}>
        <div style={styles.card} onClick={() => navigate("/student/raise-complaint")}>
          <h3>📄 Raise Complaint</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>Report hostel related issues</p>
        </div>
        <div style={styles.card} onClick={() => navigate("/student/my-complaints")}>
          <h3>📄 My Complaints</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>View status of submitted complaints</p>
        </div>
        <div style={styles.card} onClick={() => navigate("/student/outing-permission")}>
          <h3>🚪 Outing Permission</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>Request permission to leave hostel</p>
        </div>
        <div style={styles.card} onClick={() => navigate("/student/my-outings")}>
          <h3>📍 My Outings</h3>
          <p style={{ fontSize: "14px", opacity: 0.8 }}>Check status of requests</p>
        </div>
      </div>

      {/* Bottom Features (Chart & Gate Pass) */}
      <div style={styles.bottomGrid}>
        {/* LEFT: Compact Complaint Chart */}
        <div style={styles.box}>
          <h3 style={{ borderBottom: "2px solid #36A2EB", paddingBottom: "10px", marginTop: 0 }}>📊 My Complaint Status</h3>
          
          {complaints.length === 0 ? (
            <p style={{ color: "gray", textAlign: "center", marginTop: "40px" }}>No complaints raised yet.</p>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "180px", marginTop: "10px" }}>
              {/* ✅ Increased width from 180px to 280px so the words fit! */}
              <div style={{ width: "280px", height: "180px" }}>
                <Doughnut 
                  data={chartData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { 
                        position: "right", 
                        labels: { 
                          color: isDarkMode ? "#fff" : "#000",
                          boxWidth: 15, // ✅ Makes the color squares a bit smaller and neater
                          padding: 15   // ✅ Adds space between the words
                        } 
                      } 
                    }
                  }} 
                />
               </div>
            </div>
          )}
        </div>

        {/* RIGHT: Digital Gate Pass / QR Code */}
        <div style={styles.box}>
          <h3 style={{ borderBottom: "2px solid #9966FF", paddingBottom: "10px", marginTop: 0 }}>📱 Digital Gate Pass</h3>
          
          {activeGatePass ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
              {/* QR Code needs a white background to scan perfectly */}
              <div style={{ background: "white", padding: "10px", borderRadius: "8px" }}>
                <QRCode 
                  value={`VALID_PASS_${activeGatePass.id || activeGatePass._id}_${studentName}`} 
                  size={120} 
                />
              </div>
              <div>
                <h4 style={{ color: "#4BC0C0", margin: "0 0 10px 0" }}>✅ APPROVED</h4>
                <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Name:</strong> {studentName}</p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}><strong>Reason:</strong> {activeGatePass.reason}</p>
               <p style={{ margin: "5px 0", fontSize: "14px" }}>
  <strong>Date:</strong> {new Date(activeGatePass.outingDate || activeGatePass.createdAt).toLocaleDateString()}
</p>
                <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "orange" }}>*Show this QR code at the main gate.</p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "40px", color: "gray" }}>
              <span style={{ fontSize: "40px" }}>🚫</span>
              <p>No active gate passes.</p>
              <small>Apply for an outing permission. Once the Warden approves it, your QR code will generate here automatically.</small>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;