const express = require("express");
const router = express.Router();
const deliveryController = require("../controller/delivery.controller");
const { Deliveries } = require("../models"); // import your Sequelize model

// Delivery CRUD
router.post("/", deliveryController.createDelivery);
router.get("/", deliveryController.getAllDeliveries);
router.get("/driver", deliveryController.getDeliveriesByDriver);
router.get("/customer", deliveryController.getDeliveriesByCustomer);
router.get("/:id", deliveryController.getDeliveryById);
router.put("/:id", deliveryController.updateDelivery);
router.delete("/:id", deliveryController.deleteDelivery);

// 🔹 Additional endpoints for admin dashboard analytics

// Get unassigned deliveries (no driver yet)
router.get("/status/unassigned", async (req, res) => {
  try {
    const deliveries = await Deliveries.findAll({
      where: { driver_id: null },
    });
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching unassigned deliveries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get deliveries currently in route
router.get("/status/in-route", async (req, res) => {
  try {
    const deliveries = await Deliveries.findAll({
      where: { status: "in-route" },
    });
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries in route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
