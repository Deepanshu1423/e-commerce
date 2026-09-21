const express = require("express");

const {
  getAllOrders,
  getOrderById,
  searchOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/", getAllOrders);

// Search route must come before /:id
router.get("/search", searchOrders);

router.get("/:id", getOrderById);

module.exports = router;