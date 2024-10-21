import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ip from "../ip";
import { useAuth } from "../utils/auth";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const data = {
    userEmail: username,
    password: password,
  };

  const loginUser = () => {
    fetch(`${ip}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return console.error("Error at login solicitation: ", error);
        }

        return response.json();
      })
      .then((data) => {
        toggleAlert("Success", data.message);
        login();
        setTimeout(() => {
          navigate("/tasks");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error at login: ", error);
      });
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:2399/auth/google";
  };

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
    <div className="login-container">
      <div className="login-box box">
        <h1 className="login-title">Welcome Back!</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <div className="login-input">
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={username}
            type="text"
            placeholder="Username or Email"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />

          <button onClick={loginUser} className="login-button">
            Login
          </button>

          <button onClick={handleLogin} className="google-login-button">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="google-logo"
            />
            Sign in with Google
          </button>
        </div>
      </div>

      <div id="alert-message" className={`${showAlert ? "show" : ""}`}>
        <h1 className="alert-title">Sucesso</h1>
        <p className="alert-message"></p>
        <button onClick={toggleAlert}>Fechar</button>
      </div>
    </div>
  );
};

export default Login;
