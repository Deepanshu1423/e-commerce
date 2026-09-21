const pool = require("../config/db");

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.*,

        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'price', oi.price,
              'product_image', oi.product_image
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items

      FROM orders o

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      GROUP BY o.id

      ORDER BY o.id DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Get orders error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get order
    const orderResult = await pool.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get order products
    const itemsResult = await pool.query(
      `
      SELECT *
      FROM order_items
      WHERE order_id = $1
      ORDER BY id ASC
      `,
      [id],
    );

    // Get order tracking
    const trackingResult = await pool.query(
      `
      SELECT *
      FROM order_tracking
      WHERE order_id = $1
      ORDER BY tracked_at ASC
      `,
      [id],
    );

    const order = orderResult.rows[0];

    order.items = itemsResult.rows;
    order.tracking = trackingResult.rows;

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order by id error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

const searchOrders = async (req, res) => {
  try {
    const { type, value } = req.query;

    if (!type || !value) {
      return res.status(400).json({
        success: false,
        message: "Search type and value are required",
      });
    }

    const allowedFields = ["order_number", "mobile", "email", "customer_name"];

    if (!allowedFields.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid search type",
      });
    }

    const query = `
      SELECT
        o.*,

        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_name', oi.product_name,
              'quantity', oi.quantity,
              'price', oi.price,
              'product_image', oi.product_image
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items

      FROM orders o

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      WHERE o.${type} ILIKE $1

      GROUP BY o.id

      ORDER BY o.id DESC
    `;

    const result = await pool.query(query, [`%${value}%`]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Search order error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to search orders",
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  searchOrders,
};
