const bcrypt = require("bcryptjs");
const pool = require("../db/db");
const logger = require("./logger");

const findUser = async (userEmail) => {
  try {
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
      return null;
    }

    return user.rows[0];
  } catch (error) {
    logger.error("Error searching user: " + error.message);
    console.error("Error during login: ", error);
    return null;
  }
};

module.exports = findUser;
