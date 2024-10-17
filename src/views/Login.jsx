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
        console.error("Erro ao efetuar login: ", error);
      });
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:2399/auth/google";
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

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

        <button onClick={loginUser}>Login</button>

        <button onClick={handleLogin} className="google-login-button">
          <i className="material-icons">account_circle</i> Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
