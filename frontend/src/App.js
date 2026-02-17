import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import RaiseComplaint from "./pages/RaiseComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import MyComplaints from "./pages/MyComplaints";
import Profile from "./pages/Profile";
import OutingPermission from "./pages/OutingPermission";
import MyOutings from "./pages/MyOutings";
import WardenDashboard from "./pages/warden/WardenDashboard";
import WardenComplaints from "./pages/warden/WardenComplaints";
import ComplaintDetails from "./pages/warden/ComplaintDetails";
import WardenOutingRequests from "./pages/warden/WardenOutingRequests";
import WardenProfile from "./pages/warden/WardenProfile";

// Helper component to ensure theme is applied whenever you navigate
function ThemeSync() {
  const location = useLocation();
  
  useEffect(() => {
    // Check the saved theme from localStorage
    const savedTheme = localStorage.getItem("appTheme");
    
    // Apply the class to the body tag so CSS variables work
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [location]); // Re-run this check every time the route (location) changes

  return null;
}

function App() {
  return (
    <Router>
      {/* This component runs in the background to keep your theme synced */}
      <ThemeSync /> 
      
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard */}
        <Route
          path="/student/dashboard"
          element={<StudentDashboard />}
        />

        {/* Raise Complaint Page */}
        <Route
          path="/student/raise-complaint"
          element={<RaiseComplaint />}
        />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/student/my-complaints" element={<MyComplaints />} />

        <Route
          path="/student/outing-permission"
          element={<OutingPermission />}
        />
        <Route path="/student/my-outings" element={<MyOutings />} />
        <Route path="/student/profile" element={<Profile />} />

        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/complaints" element={<WardenComplaints />} />
        <Route path="/warden/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/warden/outing-requests" element={<WardenOutingRequests />} />
        <Route path="/warden/profile" element={<WardenProfile />} />
      </Routes>
    </Router>
  );
}

export default App;