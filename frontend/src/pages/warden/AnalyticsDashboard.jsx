import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTED NAVIGATION
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate(); // ✅ INITIALIZED NAVIGATE

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints/stats/categories"); 
      
      if (res.data && res.data.length > 0) {
        const labels = res.data.map((item) => item._id || "Other Issues");
        const counts = res.data.map((item) => item.count);

        setData({
          labels: labels,
          datasets: [
            {
              label: "Live Issues Distribution",
              data: counts,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
              hoverOffset: 10,
            },
          ],
        });
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 5000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", color: "white" }}>
      
      {/* ✅ ADDED THIS BACK BUTTON */}
      <button 
        onClick={() => navigate("/warden/dashboard")}
        style={{
          padding: "10px 15px",
          backgroundColor: "#333",
          color: "white",
          border: "1px solid #555",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px"
        }}
      >
        <span>⬅️</span> Back to Dashboard
      </button>

      <h2 style={{ textAlign: "center", marginTop: "0" }}>📊 Real-Time Infrastructure Monitoring</h2>
      <p style={{ textAlign: "center", color: "#36A2EB" }}>● Live Status: Monitoring Backend Activity...</p>
      
      <div style={{ marginTop: "30px", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(54, 162, 235, 0.3)" }}>
        {data ? (
          <div style={{ color: "#333" }}>
            <div style={{ marginBottom: "50px" }}>
              <h4 style={{textAlign: 'center'}}>Complaint Distribution (%)</h4>
              <Pie data={data} options={{ animation: { duration: 1000 } }} />
            </div>
            <hr />
            <div style={{ marginTop: "30px" }}>
              <h4 style={{textAlign: 'center'}}>Volume per Department</h4>
              <Bar data={data} options={{ animation: { duration: 1000 } }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            <p>Waiting for backend data stream...</p>
            <small>Ensure your MongoDB complaints have a "category" or "issue" field.</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;