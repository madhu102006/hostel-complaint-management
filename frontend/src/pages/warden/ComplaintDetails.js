import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Warden.css";
import BackButton from "../../components/BackButton";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/complaints/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaint(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching complaint details:", err);
        setLoading(false);
      });
  }, [id]);

  const updateStatus = (newStatus) => {
    fetch(`http://localhost:5000/api/complaints/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        status: newStatus,
        rejectionReason: newStatus === "Rejected" ? rejectReason : "" 
      }),
    })
      .then((res) => res.json())
      .then((updatedComplaint) => {
        setComplaint(updatedComplaint);
        alert(`Complaint marked as ${newStatus}`);
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  if (loading) return <div className="warden-container"><p>Loading details...</p></div>;
  if (!complaint) return <div className="warden-container"><p>Complaint not found.</p></div>;

  // Helper to check status safely (handles "pending", "Pending", "PENDING")
  const isPending = complaint.status && complaint.status.toLowerCase() === "pending";

  return (
    <div className="warden-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <BackButton />
        <h2>Complaint Details</h2>
      </div>

      <div className="complaint-box">
        <p><strong>Student ID:</strong> {complaint.studentId}</p>
        <p><strong>Room No:</strong> {complaint.roomNumber}</p>
        <p><strong>Issue Type:</strong> {complaint.issue || complaint.type}</p>
        <p><strong>Complaint ID:</strong> {id}</p>

        <div className="complaint-text" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <p><strong>Description:</strong></p>
          <p>{complaint.description}</p>
        </div>

        <p><strong>Status:</strong> <span style={{ fontWeight: "bold", color: complaint.status === "Resolved" ? "green" : complaint.status === "Rejected" ? "red" : "orange" }}>{complaint.status}</span></p>

        {/* FIXED: Case-insensitive check */}
        {isPending && (
          <div className="action-buttons">
            <button
              className="approve"
              onClick={() => updateStatus("Resolved")}
            >
              Resolve
            </button>

            <button
              className="reject"
              onClick={() => updateStatus("Rejected")}
            >
              Reject
            </button>
          </div>
        )}

        {/* Show rejection reason input if rejecting */}
        {complaint.status === "Rejected" && (
           <p><strong>Rejection Reason:</strong> {complaint.rejectionReason || "No reason provided"}</p>
        )}
      </div>
    </div>
  );
}

export default ComplaintDetails;