import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const isDarkMode = localStorage.getItem("appTheme") === "dark";

  const handleLogin = async () => {
    if (!userId || !password) {
      alert("Please enter User ID and Password");
      return;
    }

    // --- WARDEN LOGIN (Hardcoded) ---
    if (role === "admin") {
      if (userId === "admin" && password === "admin123") {
        localStorage.setItem("wardenLoggedIn", "true"); // Optional: Remember warden is logged in
        navigate("/warden/dashboard");
      } else {
        alert("Invalid Admin Credentials! Try ID: 'admin' and Pass: 'admin123'");
      }
      return;
    }

    // --- STUDENT LOGIN (Database) ---
    try {
      const response = await fetch("http://localhost:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: userId, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("studentId", userId);
        navigate("/student/dashboard");
      } else {
        alert("Login Failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Is backend running?");
    }
  };

  // Styles
  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: isDarkMode ? "#121212" : "#f2f2f2",
      transition: "background 0.3s",
    },
    card: {
      padding: "30px",
      background: isDarkMode ? "#1e1e1e" : "#fff",
      borderRadius: "8px",
      width: "300px",
      textAlign: "center",
      boxShadow: isDarkMode ? "0 4px 8px rgba(255,255,255,0.05)" : "0 4px 8px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#fff" : "#000",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "10px 0",
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
    heading: {
      marginBottom: "20px",
      color: isDarkMode ? "#fff" : "#333",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Hostel Complaint System</h2>

        <input 
          type="text" 
          placeholder={role === "admin" ? "Admin ID" : "Roll Number"} 
          style={styles.input}
          value={userId}
          onChange={(e) => setUserId(e.target.value)} 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          style={styles.input} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="student">Student</option>
          <option value="admin">Warden</option>
        </select>

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        {role === "student" && (
          <p 
            style={{ marginTop: "15px", cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
            onClick={() => navigate("/register")}
          >
            New Student? Register Here
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;