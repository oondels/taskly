import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./utils/auth";
import ProtectedRoute from "./utils/protectedRoute";

import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
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
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
