import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const isDarkMode = localStorage.getItem("appTheme") === "dark";

  const [form, setForm] = useState({
    studentId: "",
    password: "", // Added password
    name: "",
    email: "",
    phoneNumber: "",
    hostel: "",
    roomNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  // Styles
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
      padding: "30px",
      background: isDarkMode ? "#1e1e1e" : "#fff",
      borderRadius: "8px",
      width: "350px",
      boxShadow: isDarkMode ? "0 4px 8px rgba(255,255,255,0.05)" : "0 4px 8px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#fff" : "#000",
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "4px",
      border: isDarkMode ? "1px solid #444" : "1px solid #ccc",
      background: isDarkMode ? "#333" : "#fff",
      color: isDarkMode ? "#fff" : "#000",
    },
    button: {
      width: "100%",
      padding: "10px",
      background: "#28a745",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      marginTop: "15px",
      borderRadius: "4px",
      fontWeight: "bold",
    },
    link: {
      display: "block",
      marginTop: "15px",
      textAlign: "center",
      color: "#1976d2",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2 style={{ textAlign: "center" }}>Student Registration</h2>

        <input name="studentId" placeholder="Roll Number (User ID)" onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={styles.input} required />
        <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} required />
        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} style={styles.input} required />
        <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} style={styles.input} required />
        <input name="hostel" placeholder="Hostel Name (e.g. Boys A)" onChange={handleChange} style={styles.input} required />
        <input name="roomNumber" placeholder="Room Number" onChange={handleChange} style={styles.input} required />

        <button type="submit" style={styles.button}>Register</button>

        <span style={styles.link} onClick={() => navigate("/")}>
          Already have an account? Login
        </span>
      </form>
    </div>
  );
}

export default Register;