import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Warden.css";

function WardenOutingRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH REAL DATA
  useEffect(() => {
    fetch("http://localhost:5000/api/outingrequests")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setLoading(false);
      });
  }, []);

  // APPROVE REQUEST
  const approveRequest = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/outingrequests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (response.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "Approved" } : r))
        );
      }
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  // ✅ FIXED: REJECT REQUEST - Now sends wardenResponse to backend
  const rejectRequest = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const response = await fetch(`http://localhost:5000/api/outingrequests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "Rejected",
          wardenResponse: reason  // ✅ NOW SENDING REASON TO BACKEND
        }),
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? updatedRequest : r
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="warden-container">
      {/* TOP BAR */}
      <div className="warden-topbar">
        <span className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </span>
        <h2>Outing Requests</h2>
      </div>

      {/* REQUEST LIST */}
      <div className="list-container">
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No outing requests found.</p>
        ) : (
          requests.map((r) => (
            <div key={r._id} className="list-card">
              {/* Display Student ID since we don't have names joined yet */}
              <h3>Student ID: {r.studentId}</h3>
              <p><strong>Reason:</strong> {r.reason}</p>
              
              {/* Format Dates */}
              <p><strong>From:</strong> {new Date(r.outingDate).toLocaleString()}</p>
              <p><strong>To:</strong> {new Date(r.returnDate).toLocaleString()}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    r.status === "Approved"
                      ? "status approved"
                      : r.status === "Rejected"
                      ? "status rejected"
                      : "status pending"
                  }
                >
                  {r.status}
                </span>
              </p>

              {/* ✅ FIXED: Show wardenResponse instead of rejectReason */}
              {r.wardenResponse && (
                <p className="reject-text">
                  <strong>Warden's Response:</strong> {r.wardenResponse}
                </p>
              )}

              {r.status === "Pending" && (
                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => approveRequest(r._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => rejectRequest(r._id)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WardenOutingRequests;