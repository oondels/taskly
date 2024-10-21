import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./utils/auth";
import ProtectedRoute from "./utils/protectedRoute";

import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
import EmailVerification from "./views/EmailVerification";
import EmailVerificationFailed from "./views/EmailVerificationFailed";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import TaskList from "./views/TaskList";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    {" "}
                    <TaskList />{" "}
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/email-verification"
                element={<EmailVerification />}
              />
              <Route
                path="/email-verification-failed"
                element={<EmailVerificationFailed />}
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
