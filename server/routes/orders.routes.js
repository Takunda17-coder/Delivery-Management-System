const express = require("express");
const router = express.Router();
const ordersController = require("../controller/orders.controller");

// More specific routes first
router.get("/status/unattended", ordersController.getUnattendedOrders);

// CRUD routes
router.post("/", ordersController.createOrder);
router.get("/", ordersController.getAllOrders);
router.get("/:id", ordersController.getOrderById);
router.get("/:customerId", ordersController.getOrdersByCustomer);
router.put("/:id", ordersController.updateOrder);
router.delete("/:id", ordersController.deleteOrder);

module.exports = router;
