import "./App.css";
import TaskList from "./views/TaskList";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Task Manager</h1>
      </header>
      <TaskList />
    </div>
  );
}

export default App;
