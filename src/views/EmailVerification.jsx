import React from "react";
import { useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="email-verified-container">
      <div className="email-verified-box box">
        <h1 className="email-verified-title">Email Verification Successful!</h1>
        <p className="email-verified-message">
          Thank you for verifying your email. Your account is now active and you
          can log in to access all features.
        </p>
        <button onClick={handleGoToLogin} className="email-verified-button">
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
