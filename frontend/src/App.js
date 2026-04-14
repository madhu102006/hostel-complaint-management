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
import RegisteredStudents from "./pages/warden/RegisteredStudents";

// --- NEW ANALYTICS IMPORT ---
import AnalyticsDashboard from "./pages/warden/AnalyticsDashboard"; 

function ThemeSync() {
  const location = useLocation();
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [location]);
  return null;
}

function App() {
  return (
    <Router>
      <ThemeSync /> 
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Section */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/raise-complaint" element={<RaiseComplaint />} />
        <Route path="/student/my-complaints" element={<MyComplaints />} />
        <Route path="/student/outing-permission" element={<OutingPermission />} />
        <Route path="/student/my-outings" element={<MyOutings />} />
        <Route path="/student/profile" element={<Profile />} />

        {/* Warden Section */}
        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/complaints" element={<WardenComplaints />} />
        <Route path="/warden/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/warden/outing-requests" element={<WardenOutingRequests />} />
        <Route path="/warden/profile" element={<WardenProfile />} />
        <Route path="/warden/student-list" element={<RegisteredStudents />} />

        {/* --- NEW FEATURE: ANALYTICS --- */}
        <Route path="/warden/analytics" element={<AnalyticsDashboard />} />

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;