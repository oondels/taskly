import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import TaskList from "./views/TaskList";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/tasks">Task List</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer>Hendrius Félix</footer>
      </div>
    </Router>
  );
};

export default App;
