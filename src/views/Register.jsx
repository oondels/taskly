import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ip from "../ip";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const userData = {
    name: name,
    username: username,
    email: email,
    password: password,
  };

  const registerUser = () => {
    if (!name || !username || !email || !password) {
      return toggleAlert("Error", "All Fields Are Required!");
    }

    fetch(`${ip}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((errorData) => {
            console.error("Error at register solicitation: ", errorData);
            return toggleAlert(
              "Error",
              errorData.message || "Error at register solicitation!"
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        if (data.error) {
          return toggleAlert("Error", data.message);
        }
        toggleAlert("Success", data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error at register: ", error);
      });
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:2399/auth/google";
  };

  return (
    <div className="register-container">
      <div className="register-box box">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Sign up to get started</p>

        <div className="register-input">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
          />
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={username}
            type="text"
            placeholder="Username"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />

          <button onClick={registerUser} className="register-button">
            Register
          </button>

          <button
            onClick={handleGoogleRegister}
            className="google-register-button"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="google-logo"
            />
            Sign up with Google
          </button>
        </div>
      </div>

      <div id="alert-message" className={`${showAlert ? "show" : ""}`}>
        <h1 className="alert-title">Success</h1>
        <p className="alert-message"></p>
        <button onClick={() => toggleAlert()}>Close</button>
      </div>
    </div>
  );
};

export default Register;
