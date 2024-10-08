const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const cookieParser = require("cookie-parser");

require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check password validity
    if (
      !(
        (
          validator.isLength(password, { min: 7 }) &&
          /[A-Z]/.test(password) && // Pelo menos uma letra maiúscula
          /[a-z]/.test(password) && // Pelo menos uma letra minúscula
          /\d/.test(password) && // Pelo menos um número
          /\W/.test(password)
        ) // Pelo menos um caractere especial
      )
    ) {
      return res
        .status(403)
        .json({ message: "Password does not meet the requirements." });
    }

    // Check email validity
    if (!validator.isEmail(email)) {
      return res.status(403).json({ message: "Invalid Email" });
    }

    // Check username disponibility
    const checkUser = await pool.query(
      `
        SELECT
            username 
        FROM
            task_manager.users
        WHERE 
            username = $1;
    `,
      [username]
    );
    if (checkUser.rows.length > 0) {
      return res.status(403).json({ message: "Username already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const postUser = await pool.query(
      `
      INSERT INTO 
        task_manager.users (username, name, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [username, name, email, hashedPassword]
    );

    if (postUser.rows.length === 0) {
      return res.status(400).json({ message: "Failed to Register" });
    }

    return res.status(201).json({ message: "Registered Successfully." });
  } catch (error) {
    console.error("Error to register: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const user = await pool.query(
      `
    SELECT 
        name, username, email, password
    FROM
        task_manager.users
    WHERE
        username = $1 OR email = $1
    `,
      [userEmail]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User or Email not found." });
    }

    const checkPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!checkPassword) {
      return res.status(403).json({ message: "Invalid Credentials." });
    }

    const token = jwt.sign(
      { username: user.rows[0].username, name: user.rows[0].name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.status(200).json({
      message: `Welcome ${user.rows[0].username}`,
      token,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
