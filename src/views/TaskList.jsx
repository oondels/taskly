import React, { useState } from "react";

const TaskList = () => {
  const [showForm, setShowForm] = useState(false);
  const [priority, setPriority] = useState(1); // Ajuste inicial para corresponder ao valor mínimo do input

  const handlePriorityChange = (e) => {
    setPriority(parseInt(e.target.value));
  };

  const getPriorityText = (value) => {
    switch (value) {
      case 1:
        return "Less Important";
      case 2:
        return "Low Importance";
      case 3:
        return "Normal Importance";
      case 4:
        return "High Importance";
      case 5:
        return "Most Important";
      default:
        return "Undefined";
    }
  };

  const toggleTaskForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="tasks-container">
      <i
        onClick={toggleTaskForm}
        className="material-symbols-outlined add-task"
      >
        add_circle
      </i>

      <div className="tasks-list">
        <h3>Tasks List</h3>
      </div>

      <div className="task-actions">
        <div className="search">
          <input type="text" placeholder="Search" />
          <i className="material-icons">search</i>
        </div>
      </div>

      <div
        id="task-form-container"
        className={`add-task-container ${showForm ? "show" : ""}`}
      >
        <i onClick={toggleTaskForm} className="material-symbols-outlined close">
          cancel
        </i>

        <div className="task-title">
          <h4>Add Task</h4>
          <i className="material-icons">task</i>
        </div>

        <input type="text" placeholder="Title" />
        <input type="text" placeholder="Description" />

        <label className="due-date-label" htmlFor="priority">
          Priority
        </label>
        <input
          name="priority"
          id="priority"
          type="range"
          min="1"
          max="5"
          step="1"
          value={priority}
          onChange={handlePriorityChange}
        />
        <span>{getPriorityText(priority)}</span>

        <label className="due-date-label" htmlFor="due-date">
          Due Date
        </label>
        <input type="date" name="due-date" id="due-date" />

        <button className="add-task-button">Add Task</button>
      </div>
    </div>
  );
};

export default TaskList;
