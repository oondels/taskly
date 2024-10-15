import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
      <nav>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/tasks">Task List</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <span className="switch-container">
        <label className="switch">
          <input type="checkbox" id="mode-switch" />
          <span className="slider"></span>
        </label>
      </span>
    </header>
  );
};

export default Navbar;
