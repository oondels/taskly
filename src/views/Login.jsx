import React, { useState } from "react";
import ip from "../ip";
import { useAuth } from "../utils/auth";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

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
        alert(data.message);
        login();
        console.log(data);
      })
      .catch((error) => {
        console.error("Error at login: ", error);
      });
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:2399/auth/google";
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
    </div>
  );
};

export default Login;
