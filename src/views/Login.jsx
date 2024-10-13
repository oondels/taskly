import React, { useState } from "react";
import ip from "../ip";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

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
    })
      .then((response) => {
        if (!response.ok) {
          return console.error("Error at login solicitation: ", error);
        }

        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <div className="login-container">
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
      </div>
    </div>
  );
};

export default Login;
