const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("./db/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./utils/auth/authRoutes");
const authMiddleware = require("./utils/auth/auth");

const app = express();
const port = 2399;

app.use(cors());
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
