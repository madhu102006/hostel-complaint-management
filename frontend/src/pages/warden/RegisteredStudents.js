import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisteredStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Assuming your route is mounted at /api/students in your server.js
const response = await fetch("http://localhost:5000/api/students/all");
        if (response.ok) {
          const data = await response.json();
          console.log("Students from DB:", data); // Check your F12 console to see the data!
          setStudents(data);
        } else {
          console.error("Failed to fetch students. Status:", response.status);
        }
      } catch (error) {
        console.error("Network Error:", error);
      }
    };

    fetchStudents();
  }, []);

  const styles = {
    container: { padding: "30px", fontFamily: "Arial, sans-serif", color: "white" }, // adjusted for dark mode
    headerBox: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    backBtn: { padding: "8px 16px", cursor: "pointer", backgroundColor: "#333", color: "white", border: "1px solid #555", borderRadius: "4px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", backgroundColor: "#1e1e1e" },
    th: { backgroundColor: "#36A2EB", color: "white", padding: "12px", textAlign: "left", borderBottom: "2px solid #555" },
    td: { padding: "12px", borderBottom: "1px solid #333", textAlign: "left", color: "#ddd" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h2>👥 Registered Hostel Students</h2>
        <button style={styles.backBtn} onClick={() => navigate("/warden/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      {students.length === 0 ? (
        <p style={{ color: "orange" }}>Loading students or no students registered yet...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone Number</th>
              <th style={styles.th}>Hostel</th>
              <th style={styles.th}>Room Number</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                {/* THESE MUST MATCH YOUR MONGODB EXACTLY */}
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.email}</td>
                <td style={styles.td}>{student.phoneNumber}</td>
                <td style={styles.td}>{student.hostel}</td>
                <td style={styles.td}>{student.roomNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RegisteredStudents;