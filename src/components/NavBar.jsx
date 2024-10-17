import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const test = () => {
    const navBar = document.querySelector("nav");
    navBar.classList.toggle("show");
  };

  return (
    <header>
      <span onClick={test} className="material-symbols-outlined menu-icon">
        menu
      </span>
      <nav>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/tasks">Task List</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <span className="switch-container">
          <button>Logout</button>
          <label className="switch">
            <input type="checkbox" id="mode-switch" />
            <span className="slider"></span>
          </label>
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
