import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ip from "../ip";
import { useAuth } from "../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleProfileMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const logout = async () => {
    if (user) {
      try {
        const response = await fetch(`${ip}/auth/logout`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          window.location.href = "/login";
        } else {
          console.error("Erro ao fazer logout");
        }
      } catch (error) {
        console.error("Erro durante logout: ", error);
      }
    }
  };

  const openNav = () => {
    const navBar = document.querySelector("nav");
    navBar.classList.toggle("show");
  };

  return (
    <header>
      <span onClick={openNav} className="material-symbols-outlined menu-icon">
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
          <label className="switch">
            <input type="checkbox" id="mode-switch" />
            <span className="slider"></span>
          </label>

          {user && (
            <div className="profile-nav-container">
              <i
                onClick={toggleProfileMenu}
                className={`material-symbols-outlined profile-icon ${
                  isMenuOpen ? "show" : ""
                }`}
              >
                person
              </i>

              <div className={`profile-menu ${isMenuOpen ? "show" : ""}`}>
                <ul className={`${isMenuOpen ? "show" : ""}`}>
                  <li>Profile</li>
                  <li onClick={logout}>Logout</li>
                </ul>
              </div>
            </div>
          )}
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
