import React from "react";
import "./Warden.css";
import BackButton from "../../components/BackButton";

function WardenProfile() {
  return (
    <div className="warden-container">
        <div style={{ display: "flex", alignItems: "center" }}>
        <BackButton />
      <h2>Warden Profile</h2>
      </div>

      <div className="profile-box">
        <p><strong>Name:</strong> Hostel Warden</p>
        <p><strong>Email:</strong> warden@hostel.com</p>
        <p><strong>Hostel:</strong> Girls Hostel</p>
      </div>
    </div>
  );
}

export default WardenProfile;
