require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully");
    console.log("Database time:", result.rows[0].now);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error.message);
  }
};

startServer();