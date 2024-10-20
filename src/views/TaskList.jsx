import React, { useEffect, useState } from "react";
import ip from "../ip";
import { useAuth } from "../utils/auth";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const TaskList = () => {
  const { auth } = useAuth(); // Verifica se o usuário está autenticado

  const [user, setUser] = useState("");
  const [tasks, setTasks] = useState(null);
  const [openTaskId, setOpenTaskId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const [priority, setPriority] = useState(1); // Ajuste inicial para corresponder ao valor mínimo do input
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleClickOpen = (taskId) => {
    setOpenTaskId(taskId);
  };

  const handleClose = () => {
    setOpenTaskId(null);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch(`${ip}/auth/check-auth`, {
          credentials: "include",
        });
        if (!response.ok) {
          console.error("Error getting user data");
          return;
        }
        const userData = await response.json();

        setUser(userData.user);
      } catch (error) {
        console.error("Error getting user data: ", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        if (!user) return;

        const response = await fetch(`${ip}/get-tastks/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Error fetching tasks");
          return;
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    getAllTasks();
  }, [user]);

  const updateTask = async (id, action) => {
    const response = await fetch(`${ip}/${action}-task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toggleAlert("Error", data.message);
      console.error("Error Updating Task");
      return;
    }

    const data = await response.json();
    toggleAlert("Sucesso", data.message);

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleDate = (e) => {
    setDate(e.target.value);
  };

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

  const toggleAlert = (title, message) => {
    const alertTitle = document.querySelector(".alert-title");
    const alertMessage = document.querySelector(".alert-message");

    if (title && message) {
      alertTitle.innerText = title;
      alertMessage.innerText = message;
    }

    setAlert(!showAlert);
  };

  const postTask = async () => {
    const data = {
      title: title,
      description: description,
      priority: priority,
      date: date,
      googleId: user.googleId,
      userId: user.id,
    };

    fetch(`${ip}/post-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          toggleAlert("Error", errorData.message);
          throw new Error(`Failed to post task: ${errorData.message}`);
        }

        return await response.json();
      })
      .then((data) => {
        toggleAlert("Success", data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setPriorityStatus = (priority, action) => {
    if (action === "status") {
      switch (priority) {
        case "1":
          return "Low";
        case "2":
          return "Below Average";
        case "3":
          return "Medium";
        case "4":
          return "Above Average";
        case "5":
          return "High";
        default:
          return "Unknown";
      }
    }

    switch (priority) {
      case "1":
        return "low";
      case "2":
        return "below-average";
      case "3":
        return "mediu";
      case "4":
        return "above-average";
      case "5":
        return "high";
      default:
        return "Unknown";
    }
  };

  const formatteDate = (taskDate) => {
    const date = new Date(taskDate);
    const formattedDate = date.toLocaleDateString("pt-BR");
    return formattedDate;
  };

  const setNotificationIcon = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);

    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diff = target - today; //Milliseconds
    const diffInDays = diff / (1000 * 60 * 60 * 24);

    if (diffInDays >= 0 && diffInDays <= 2) return "notifications";
    if (diffInDays < 0) return "warning";
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
        <h5>Olá {user.username}</h5>
      </div>

      <div className="task-actions">
        <div className="search">
          <input type="text" placeholder="Search" />
          <i className="material-symbols-outlined">search</i>
        </div>
      </div>

      <div
        className={`add-task-container ${showForm ? "show" : ""}`}
        id="task-form-container"
      >
        <i onClick={toggleTaskForm} className="material-symbols-outlined close">
          cancel
        </i>

        <div className="task-title">
          <h4>Add Task</h4>
          <i className="material-symbols-outlined">task</i>
        </div>

        <div className="task-data">
          <input
            value={title}
            onChange={handleTitle}
            type="text"
            placeholder="Title"
          />

          <input
            value={description}
            onChange={handleDescription}
            type="text"
            placeholder="Description"
          />

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
          <input
            value={date}
            onChange={handleDate}
            type="date"
            name="due-date"
            id="due-date"
          />

          <button onClick={postTask} className="add-task-button">
            Add Task
          </button>
        </div>
      </div>

      <div className="task-list">
        <div className="task-filters"></div>

        <ul>
          {tasks && tasks.data.length > 0 ? (
            tasks.data.map((task) => (
              <div key={task.id}>
                <li
                  onClick={() => handleClickOpen(task.id)}
                  className={`${task.status}`}
                >
                  {/* Passa o ID da tarefa clicada */}
                  <div className="task">
                    <i className="material-symbols-outlined">task</i>
                    <p>{task.title}</p>
                  </div>

                  {task && task.status === "pending" && (
                    <div
                      className={`block-status-color ${setPriorityStatus(
                        task.priority
                      )}`}
                    >
                      <span className="material-symbols-outlined">
                        {setNotificationIcon(task.due_date)}
                      </span>
                    </div>
                  )}

                  {task && task.status === "finished" && (
                    <div className="delete-task">
                      <span
                        onClick={(event) => {
                          event.stopPropagation();
                          updateTask(task.id, "delete");
                        }}
                        className="material-symbols-outlined delete"
                      >
                        delete
                      </span>
                    </div>
                  )}
                </li>

                {/* O diálogo será aberto apenas se o task.id for igual ao openTaskId */}
                <Dialog open={openTaskId === task.id} onClose={handleClose}>
                  <DialogTitle>
                    <h3 className="task-title">
                      {task.title} -{" "}
                      {setPriorityStatus(task.priority, "status")}
                    </h3>
                    <span
                      className={`bottom-line ${setPriorityStatus(
                        task.priority
                      )}`}
                    ></span>
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      <div className="task-informations">
                        <ul>
                          <li>
                            <h5>Description:</h5>
                            <p>{task.description}</p>
                          </li>
                          <li>
                            <h5>Due Date:</h5>
                            <p>{formatteDate(task.due_date)}</p>
                          </li>
                          <li>
                            <h5>Status:</h5>
                            <p>{task.status}</p>
                          </li>
                          <li>
                            <h5>Priority:</h5>
                            <p>{task.priority}</p>
                          </li>
                        </ul>
                      </div>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Fechar
                    </Button>

                    {task && task.status !== "finished" && (
                      <>
                        <Button
                          onClick={() => {
                            updateTask(
                              task.id,
                              task.status === "pending" ? "start" : "finish"
                            );
                          }}
                          color="success"
                        >
                          {task.status === "pending" ? "Start" : "Finish"}
                        </Button>

                        {task.status !== "pending" && (
                          <Button
                            onClick={() => {
                              updateTask(
                                task.id,
                                task.status === "paused" ? "resume" : "pause"
                              );
                            }}
                            color="success"
                          >
                            {task.status === "paused" ? "Resume" : "Pause"}
                          </Button>
                        )}
                      </>
                    )}
                  </DialogActions>
                </Dialog>
              </div>
            ))
          ) : (
            <li>Nenhuma tarefa disponível</li>
          )}
        </ul>
      </div>

      <div id="overlay" className={`${showForm ? "show" : ""}`}></div>
      <div id="alert-message" className={`${showAlert ? "show" : ""}`}>
        <h1 className="alert-title">Sucesso</h1>
        <p className="alert-message"></p>
        <button onClick={toggleAlert}>Fechar</button>
      </div>
    </div>
  );
};

export default TaskList;
