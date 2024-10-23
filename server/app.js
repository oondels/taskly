const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("./db/db");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");
const validator = require("validator");
require("dotenv").config();

const authRoutes = require("./utils/auth/authRoutes");
const authMiddleware = require("./utils/auth/auth");

const app = express();
const port = 2399;
const ipClient = "http://localhost:3000";

app.use(
  cors({
    origin: ipClient,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("Server listening on port: ", port);
});

app.get("/", (req, res) => {
  console.log("Hello World");
  res.status(200).json({ message: "Hello World!" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Accessed protected route" });
});

app.get("/get-tastks/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query(
      `
        SELECT 
           id, title, description, status, priority, due_date, completed_at 
        FROM 
          task_manager.tasks
        WHERE 
          user_id = $1 AND status != 'deleted'
        ORDER BY 
          due_date       
      `,
      [id]
    );
    if (query.rows.length === 0) {
      return res.status(404).json({ message: "User does not have any tasks" });
    }

    return res.status(200).json({ data: query.rows });
  } catch (error) {
    logger.error("Error getting tasks: " + error.message);
    console.error("Error getting tasks: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.put("/start-task/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query(
      `
        UPDATE task_manager.tasks
        SET status = 'started', start_date = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );
    if (query.rows.length === 0) {
      return res.status(400).json({ message: "Error Finishing Task" });
    }

    return res.status(200).json({ message: "Task Successfully Started" });
  } catch (error) {
    logger.error("Error finishing task: " + error.message);
    console.error("Error finishing task: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.put("/finish-task/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query(
      `
        UPDATE task_manager.tasks
        SET status = 'finished', completed_at = NOW(), completed = true
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );
    if (query.rows.length === 0) {
      return res.status(400).json({ message: "Error Finishing Task" });
    }

    return res.status(200).json({ message: "Task Successfully Finished" });
  } catch (error) {
    logger.error("Error finishing task: " + error.message);
    console.error("Error finishing task: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.put("/resume-task/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query(
      `
        UPDATE task_manager.tasks
        SET status = 'started'
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );
    if (query.rows.length === 0) {
      return res.status(400).json({ message: "Error Resuming Task" });
    }

    return res.status(200).json({ message: "Task Successfully Resumed" });
  } catch (error) {
    logger.error("Error finishing task: " + error.message);
    console.error("Error finishing task: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.put("/pause-task/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query(
      `
        UPDATE task_manager.tasks
        SET status = 'paused'
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );
    if (query.rows.length === 0) {
      return res.status(400).json({ message: "Error Pausing Task" });
    }

    return res.status(200).json({ message: "Task Successfully Paused" });
  } catch (error) {
    logger.error("Error finishing task: " + error.message);
    console.error("Error finishing task: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.put("/delete-task/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const query = await pool.query(
      `
        UPDATE task_manager.tasks
        SET status = 'deleted'
        WHERE id = $1
        RETURNING *
      `,
      [id]
    );
    if (query.rows.length === 0) {
      return res.status(400).json({ message: "Error Deliting Task" });
    }

    return res.status(200).json({ message: "Task Successfully Deleted" });
  } catch (error) {
    logger.error("Error finishing task: " + error.message);
    console.error("Error finishing task: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

app.put("/update-profile", async (req, res) => {
  const { oldPass, newPass, repeatPass, user } = req.body;
  const details = {
    newName: "name",
    newUsername: "username",
    oldPass: "password",
  };
  let params = [];
  let userData = {};
  Object.keys(req.body).forEach((key) => {
    if (
      key !== "user" &&
      key !== "newPass" &&
      key !== "repeatPass" &&
      key !== "oldPass"
    ) {
      userData[key] = req.body[key];
    }
  });

  let query = `UPDATE task_manager.users SET `;
  Object.keys(userData).forEach((key, index, array) => {
    if (index === array.length - 1) {
      query += `${details[key]} = $${index + 1} `;
      params.push(req.body[key]);
    } else {
      query += `${details[key]} = $${index + 1}, `;
      params.push(req.body[key]);
    }
  });

  if (oldPass) {
    if (query.includes("$")) {
      query += `, password = $${params.length + 1} `;
    } else {
      query += ` password = $${params.length + 1} `;
    }

    if (!newPass || !repeatPass) {
      console.log("Insira todos os dados da senha");
      return res
        .status(403)
        .json({ message: "You must to insert all password data" });
    }

    if (newPass !== repeatPass) {
      return res
        .status(403)
        .json({ message: "The passwords do not match. Please try again." });
    }

    if (
      !(
        validator.isLength(newPass, { min: 7 }) &&
        /[A-Z]/.test(newPass) &&
        /[a-z]/.test(newPass) &&
        /\d/.test(newPass) &&
        /\W/.test(newPass)
      )
    ) {
      return res.status(403).json({
        message:
          "Password does not meet the requirements. Minimum length of 7 characters, at least one uppercase letter, one number, and at least one special character.",
        error: true,
      });
    }

    const queryUserPass = await pool.query(
      `
        SELECT password
        FROM task_manager.users
        WHERE id = $1
      `,
      [user.id]
    );
    const foundUser = queryUserPass.rows[0];
    const checkPassword = await bcrypt.compare(oldPass, foundUser.password);

    if (!checkPassword) {
      return res.status(403).json({ message: "Invalid Password." });
    }
    const hashedPassword = await bcrypt.hash(newPass, 8);
    params.push(hashedPassword);
  }

  query += `WHERE id = $${params.length + 1} RETURNING *`;
  params.push(user.id);
  try {
    const updateUser = await pool.query(query, params);
    if (updateUser.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Error updating profile. Contact Support for help." });
    }

    res
      .status(200)
      .json({ message: "Profile Updated Successfully.", status: true });
  } catch (error) {
    console.error("Error updating profile: ", error);
    res
      .status(500)
      .json({ message: "Internal Server Error. Contact Support for help." });
  }
});

app.post("/post-task", async (req, res) => {
  try {
    const data = req.body;

    const query = await pool.query(
      `
      INSERT INTO task_manager.tasks (title, description, priority, due_date, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [data.title, data.description, data.priority, data.date, data.userId]
    );
    if (query.rows.length === 0) {
      return res.status(400).json({ message: "Error Posting Task" });
    }

    return res
      .status(200)
      .json({ message: `Task: ${data.title} was successfully created ` });
  } catch (error) {
    logger.error("Error during post task: " + error.message);
    console.error("Error posting task: ", error.message);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});
