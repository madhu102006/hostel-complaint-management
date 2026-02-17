import React, { useState, useEffect } from "react";
// Removed unused useNavigate import to fix warning
import BackButton from "../components/BackButton"; // FIXED: Changed from ../../ to ../

function StudentProfile() {
  const studentId = localStorage.getItem("studentId"); 
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDarkMode = localStorage.getItem("appTheme") === "dark";

  useEffect(() => {
    fetch(`http://localhost:5000/api/students/${studentId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Student not found");
        }
        return res.json();
      })
      .then((data) => {
        setStudent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [studentId]);

  const styles = {
    container: {
      padding: "30px",
      background: isDarkMode ? "#121212" : "#f4f6f8",
      minHeight: "100vh",
      color: isDarkMode ? "#fff" : "#000",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    card: {
      background: isDarkMode ? "#1e1e1e" : "#fff",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      width: "400px",
      marginTop: "20px",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: isDarkMode ? "1px solid #333" : "1px solid #eee",
    },
    label: {
      fontWeight: "bold",
      color: isDarkMode ? "#bbb" : "#555",
    },
    value: {
      fontWeight: "500",
      color: isDarkMode ? "#fff" : "#000",
    },
    header: {
      width: "100%",
      maxWidth: "400px",
      display: "flex",
      alignItems: "center",
      marginBottom: "20px",
    }
  };

  if (loading) return <div style={styles.container}>Loading profile...</div>;

  if (!student) return (
    <div style={styles.container}>
      <div style={styles.header}><BackButton /></div>
      <h3>Student details not found.</h3>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BackButton />
        <h2 style={{ marginLeft: "10px" }}>My Profile</h2>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Name</span>
          <span style={styles.value}>{student.name}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Roll Number</span>
          <span style={styles.value}>{student.studentId}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Hostel</span>
          <span style={styles.value}>{student.hostel}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Room Number</span>
          <span style={styles.value}>{student.roomNumber}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Phone Number</span>
          <span style={styles.value}>{student.phoneNumber}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Email</span>
          <span style={styles.value}>{student.email}</span>
        </div>

        <div style={{ ...styles.row, borderBottom: "none" }}>
          <span style={styles.label}>Role</span>
          <span style={styles.value}>{student.role}</span>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;