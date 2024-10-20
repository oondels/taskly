import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/register");
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Taskly</h1>
        <h2>Your Ultimate Task Management Solution</h2>
        <p>
          Keep track of your tasks, organize your workflow, and boost your
          productivity. Taskly helps you stay organized and focused, allowing
          you to prioritize your tasks effectively and meet your deadlines with
          ease.
        </p>
        <button onClick={redirect} className="get-started-button">
          Get Started
        </button>
      </div>

      <div className="features-section">
        <h3>Features</h3>
        <div className="features">
          <div className="feature">
            <i className="material-symbols-outlined">task_alt</i>
            <h4>Task Management</h4>
            <p>
              Create, edit, and track your tasks effortlessly. Organize tasks by
              priority and due dates.
            </p>
          </div>
          <div className="feature">
            <i className="material-symbols-outlined">notifications_active</i>
            <h4>Reminders</h4>
            <p>
              Get timely reminders for your upcoming tasks so you never miss a
              deadline.
            </p>
          </div>
          <div className="feature">
            <i className="material-symbols-outlined">insights</i>
            <h4>Insights & Reports</h4>
            <p>
              Gain insights into your productivity with detailed reports on your
              task progress.
            </p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h3>Ready to boost your productivity?</h3>
        <button onClick={redirect} className="get-started-button">
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default Home;
