import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import "./Warden.css";

function WardenComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/complaints")
      .then(res => res.json())
      .then(data => {
        const pending = data.filter(c => c.status === "pending");
        setComplaints(pending);
      });
  }, []);

  return (
    <div className="warden-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <BackButton />
        <h2>Student Complaints</h2>
      </div>

      <table className="warden-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Room</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map(c => (
            <tr key={c._id}>
              <td>{c.studentId}</td>
              <td>{c.roomNumber}</td>
              <td>{c.issue}</td>
              <td>{c.status}</td>
              <td>
                <button onClick={() => navigate(`/warden/complaints/${c._id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WardenComplaints;
