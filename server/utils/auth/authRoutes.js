const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const logger = require("../logger");
const nodeMailer = require("nodemailer");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const findUser = require("../authUtils");
const ip = require("../ip");

require("dotenv").config();

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

// OAuth Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let normalizedName = profile.displayName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const username =
        normalizedName.split(" ")[0] +
        "." +
        normalizedName.split(" ")[normalizedName.split(" ").length - 1];

      const checkUser = await pool.query(
        `
          SELECT
              g.email, g.username, g.id, g.name, u.user_google, u.id, u.account_validation
          FROM
              task_manager.google_users g
          INNER JOIN
              task_manager.users u ON u.user_google = g.id
          WHERE
              g.email = $1
      `,
        [profile.emails[0].value]
      );

      const checkEmail = await pool.query(
        `
          SELECT *
          FROM
              task_manager.google_users g
          INNER JOIN
              task_manager.users u ON u.email = g.email
          WHERE
              g.email = $1
      `,
        [profile.emails[0].value]
      );

      // Verificar Funcionalidade
      if (checkEmail.rows.length > 0) {
        return done(
          new Error("A user already has an account with this email"),
          null
        );
      }

      let newUser;
      if (!checkUser.rows.length > 0) {
        const userGoogle = await pool.query(
          `
          INSERT INTO
            task_manager.google_users (username, name, email, google_id)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
          `,
          [username, profile.displayName, profile.emails[0].value, profile.id]
        );

        newUser = await pool.query(
          `
          INSERT INTO
            task_manager.users (username, name, email, user_google, account_validation)
          VALUES ($1, $2, $3, $4, true)
          RETURNING *;
          `,
          [
            username,
            profile.displayName,
            profile.emails[0].value,
            userGoogle.rows[0].id,
          ]
        );
      }

      const user = {
        username: username,
        id: newUser ? newUser.rows[0].id : checkUser.rows[0].id,
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        account_validation: newUser
          ? newUser.rows[0].account_validation
          : checkUser.rows[0].account_validation,
      };

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      done(null, { user, token });
    }
  )
);

// Login routes with google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    res.cookie("token", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.redirect("http://localhost:3000/tasks");
  }
);

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
      return res.status(403).json({
        message: "Password does not meet the requirements.",
        error: true,
      });
    }

    // Check email validity
    if (!validator.isEmail(email)) {
      return res.status(403).json({ message: "Invalid Email", error: true });
    }

    // Check username disponibility
    const checkUser = await pool.query(
      `
        SELECT
            username, email
        FROM
            task_manager.users
        WHERE
            username = $1 AND email = $2;
    `,
      [username, email]
    );
    if (checkUser.rows.length > 0) {
      return res
        .status(403)
        .json({ message: "Username or Email already in use.", error: true });
    }

    const verificationToken = jwt.sign(
      {
        email: email,
        username: username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const verificationLink = `${ip}/auth/verify-email?token=${verificationToken}`;
    // Envio de Email
    await transporter
      .sendMail({
        to: email,
        subject: `Email Verification - Taskly`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #0d9757; font-size: 24px; margin: 0;">Welcome to Taskly!</h1>
            </div>

            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h2 style="color: #0056b3; font-size: 20px; margin: 0 0 10px;">Hello <strong>${name}</strong>,</h2>
              <p style="font-size: 16px; color: #555; margin: 10px 0;">Thank you for creating an account with Taskly. We're excited to have you onboard!</p>

              <h1 style="color: #0d9757; font-size: 22px; margin-bottom: 10px;">Account Details:</h1>
              <p style="font-size: 16px; color: #555;">Username: <strong>${username}</strong></p>
              <p style="font-size: 16px; color: #555;">Email: <strong>${email}</strong></p>

              <p style="font-size: 16px; color: #555; margin-top: 20px;">You can now start managing your tasks efficiently using Taskly.</p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${verificationLink}" style="background-color: #3f51b5; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 8px; font-size: 16px;">Click Here To Activate Your Account!</a>
              </div>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #777; font-size: 14px;">
              <p>This email was generated automatically. Please do not reply.</p>
            </div>
          </div>
        `,
      })
      .then(() => {
        console.log("Email sent");
        return res.status(201).json({
          message:
            "Registered Successfully. You received an Email to cofirm your account.",
          error: false,
        });
      })
      .catch((error) => {
        console.error("Error sending email: ", error);
        logger.error("Error sending email: " + error.message);

        return res.status(400).json({
          message:
            "Error sending email verification, please check if your email is correct.",
          error: true,
        });
      });

    const hashedPassword = await bcrypt.hash(password, 8);

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
      return res
        .status(400)
        .json({ message: "Failed to Register", error: true });
    }
  } catch (error) {
    logger.error("Error to register: " + error.message);
    console.error("Error to register: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: true });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const user = await findUser(userEmail);
    if (!user) return res.status(400).json({ message: "Invalid Credentials." });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(403).json({ message: "Invalid Credentials." });
    }

    const token = jwt.sign(
      {
        username: user.username,
        name: user.name,
        id: user.id,
        account_validation: user.account_validation,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict", // Prevent CSRF
    });

    return res.status(200).json({
      message: `Welcome ${user.username}`,
      token,
    });
  } catch (error) {
    logger.error("Error during login: " + error.message);
    console.error("Error during login: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  res.status(200).json({ message: "Successfully Logout" });
});

router.get("/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    return res
      .status(401)
      .json({ authenticated: false, message: "Error decodificating Token" });
  }
});

router.get("/resend-email", async (req, res) => {
  const id = req.query.id;
  const username = req.query.username;
  const email = req.query.email;

  const verificationToken = jwt.sign(
    {
      id: id,
      username: username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const verificationLink = `${ip}/auth/verify-email?token=${verificationToken}`;

  await transporter
    .sendMail({
      to: email,
      subject: `Email Verification - Taskly`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0d9757; font-size: 24px; margin: 0;">Welcome to Taskly!</h1>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #0056b3; font-size: 20px; margin: 0 0 10px;">Hello <strong>${username}</strong>,</h2>
            <p style="font-size: 16px; color: #555; margin: 10px 0;">Thank you for creating an account with Taskly. We're excited to have you onboard!</p>

            <p style="font-size: 16px; color: #555; margin-top: 20px;">You can now start managing your tasks efficiently using Taskly.</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${verificationLink}" style="background-color: #3f51b5; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 8px; font-size: 16px;">Click Here To Activate Your Account!</a>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; color: #777; font-size: 14px;">
            <p>This email was generated automatically. Please do not reply.</p>
          </div>
        </div>
      `,
    })
    .then(() => {
      console.log("Email sent");
      return res.status(201).json({
        message:
          "Registered Successfully. You received an Email to cofirm your account.",
        error: false,
      });
    })
    .catch((error) => {
      console.error("Error sending email: ", error);
      logger.error("Error sending email: " + error.message);

      return res.status(400).json({
        message:
          "Error sending email verification, please check if your email is correct.",
        error: true,
      });
    });
});

// Continuar Daqui
router.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query(
      `
      UPDATE task_manager.users
      SET account_validation = true
      WHERE email = $1 AND username = $2
      `,
      [decoded.email, decoded.username]
    );

    res
      .status(200)
      .json({ message: "E-mail verificado com sucesso!", error: false });

    return res.redirect("http://localhost:3000");
  } catch (error) {
    res.status(400).json({ message: "Invalid Token.", error: true });
  }
});

module.exports = router;
