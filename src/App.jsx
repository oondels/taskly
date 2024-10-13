import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./utils/auth";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import TaskList from "./views/TaskList";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <header>
            <nav>
              <Link to="/">Home</Link>

              <Link to="/tasks">Task List</Link>

              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </nav>
          </header>

          <main>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TaskList />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>

          <footer>
            <div className="footer-content">
              <p>
                &copy; 2024 Taskly. Developed by Hendrius Félix. All rights
                reserved{" "}
              </p>
              <ul className="footer-links">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
                <li>
                  <a href="https://github.com/oondels" target="_blank">
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/hendriusfelix/"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
