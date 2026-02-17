import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <span
      onClick={() => navigate(-1)}
      style={{
        cursor: "pointer",
        fontSize: "22px",
        marginRight: "10px",
      }}
      title="Go Back"
    >
      ←
    </span>
  );
}

export default BackButton;
