import React, { useEffect, useState } from "react";
import ip from "../ip";

const EmailVerified = () => {
  const [showAlert, setAlert] = useState(false);
  const toggleAlert = (title, message) => {
    const alertTitle = document.querySelector(".alert-title");
    const alertMessage = document.querySelector(".alert-message");

    if (title && message) {
      alertTitle.innerText = title;
      alertMessage.innerText = message;
    }

    setAlert(!showAlert);
  };

  return (
    <div className="email-verified-container">
      <div className="email-verified-box box">
        <h1 className="email-verified-title-failed">The Token has expired!</h1>
        <p className="email-verified-message">
          Log in, and Request a new confirmation link.
        </p>
      </div>
    </div>
  );
};

export default EmailVerified;
