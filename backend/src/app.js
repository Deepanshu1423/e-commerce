const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce Order Management API is running",
  });
});

// Order Routes
app.use("/api/orders", orderRoutes);

module.exports = app;