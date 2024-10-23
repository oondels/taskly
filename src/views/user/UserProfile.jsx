import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ip from "../../ip";

import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

const UserProfile = () => {
  const location = useLocation();
  const user = location.state?.user;

  const [openUserId, setOpenUserId] = useState(null);
  const handleOpen = (userId) => {
    setOpenUserId(userId);
  };
  const handleClose = () => {
    setOpenUserId(null);
  };

  const [showAlert, setAlert] = useState(false);
  const toggleAlert = (title, message) => {
    const alertTitle = document.querySelector(".alert-title");
    const alertMessage = document.querySelector(".alert-message");

    if (title && message) {
      alertTitle.innerText = title;
      alertMessage.innerText = message;
    }

    setAlert(!showAlert);
  };

  const updateProfile = () => {
    const data = {
      newName: newName,
      newUsername: newUsername,
      oldPass: oldPass,
      newPass: newPass,
      repeatPass: repeatPass,
      user: user,
    };

    const cleanData = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (!obj[key]) {
          delete obj[key];
        }
      });
      return obj;
    };

    fetch(`${ip}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
      body: JSON.stringify(cleanData(data)),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          return toggleAlert("Error", errorData.message);
        }

        return response.json();
      })
      .then((data) => {
        if (data && data.status) {
          toggleAlert("Sucesso", data.message);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toggleAlert("Error", data);
        }
      })
      .catch((error) => {
        console.error("Internal Server Error: ", error);
        return toggleAlert("Error", error);
      });
  };

  const [newName, setNewName] = useState(null);
  const [newUsername, setNewUsername] = useState(null);
  const [oldPass, setOldPass] = useState(null);
  const [newPass, setNewPass] = useState(null);
  const [repeatPass, setRepeatPass] = useState(null);

  return (
    <div className="profile-container">
      <div className="header">
        <img
          src={"/user/default-profile.svg"}
          alt="Profile"
          className="profile-picture"
        />
        <h1>Hello, {user.name}</h1>
      </div>
      <div className="user-details">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
      </div>
      <div className="actions">
        <Dialog open={openUserId === user.id} onClose={handleClose}>
          <DialogTitle>
            <h3>Profile</h3>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className="profile-container">
                <ul>
                  <li>
                    <span className="profile-info">
                      <h5>Name: </h5>
                      <p>{user.name}</p>
                    </span>

                    <TextField
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      label="New Name"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircle />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </li>

                  <li>
                    <span className="profile-info">
                      <h5>Username: </h5>
                      <p>{user.username}</p>
                    </span>

                    <span>
                      <TextField
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        label="New Username"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </span>
                  </li>
                  <li>
                    <h5>Password:</h5>
                    <span>
                      <TextField
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        type="password"
                        label="Old Password"
                        variant="outlined"
                        fullWidth
                        className="input-password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </span>

                    <span>
                      <TextField
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        type="password"
                        label="New Password"
                        variant="outlined"
                        fullWidth
                        className="input-password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </span>

                    <span>
                      {" "}
                      <TextField
                        value={repeatPass}
                        onChange={(e) => setRepeatPass(e.target.value)}
                        type="password"
                        label="Repeat New Password"
                        variant="outlined"
                        fullWidth
                        className="input-password"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </span>
                  </li>
                </ul>
              </div>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>

            <Button onClick={updateProfile} color="success">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <button onClick={() => handleOpen(user.id)}>Edit Profile</button>
      </div>

      <div className="navigation-links">
        <Link to="/">Home</Link>
        <Link to="/tasks">Task List</Link>
      </div>

      <div id="alert-message" className={`${showAlert ? "show" : ""}`}>
        <h1 className="alert-title">Sucesso</h1>
        <p className="alert-message"></p>
        <button onClick={toggleAlert}>Fechar</button>
      </div>
    </div>
  );
};

export default UserProfile;
