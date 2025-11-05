// controllers/delivery.controller.js
const { sequelize, Delivery, Orders, Drivers, Vehicle } = require("../models");

// Ensure associations exist (run this once, ideally in models/index.js)
Delivery.belongsTo(Orders, { foreignKey: "order_id" });
Delivery.belongsTo(Drivers, { foreignKey: "driver_id" });
Delivery.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

// Create a new Delivery
exports.createDelivery = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      order_id,
      driver_id,
      vehicle_id,
      pickup_address,
      dropoff_address,
      delivery_date,
      expected_delivery_time,
      delivery_fee,
      total,
      priority,
      recipient_name,
      recipient_contact,
    } = req.body;

    // Validate required fields
    if (
      !order_id ||
      !driver_id ||
      !vehicle_id ||
      !pickup_address ||
      !dropoff_address ||
      !delivery_date ||
      !expected_delivery_time ||
      !delivery_fee ||
      !total ||
      !recipient_name ||
      !recipient_contact
    ) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Ensure related records exist
    const [order, driver, vehicle] = await Promise.all([
      Orders.findByPk(order_id, { transaction: t }),
      Drivers.findByPk(driver_id, { transaction: t }),
      Vehicle.findByPk(vehicle_id, { transaction: t }),
    ]);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // Create delivery
    const newDelivery = await Delivery.create(
      {
        order_id,
        driver_id,
        vehicle_id,
        pickup_address,
        dropoff_address,
        delivery_date,
        expected_delivery_time,
        delivery_fee,
        total,
        priority: priority || "normal",
        recipient_name,
        recipient_contact,
        status: "scheduled",
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Delivery created successfully", delivery: newDelivery });
  } catch (error) {
    await t.rollback();
    console.error("Error creating delivery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [
        { model: Orders },
        { model: Drivers },
        { model: Vehicle },
      ],
    });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id, {
      include: [
        { model: Orders },
        { model: Drivers },
        { model: Vehicle },
      ],
    });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching delivery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a delivery
exports.updateDelivery = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const updates = req.body;

    const delivery = await Delivery.findByPk(id, { transaction: t });
    if (!delivery) {
      await t.rollback();
      return res.status(404).json({ message: "Delivery not found" });
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) delivery[key] = updates[key];
    });

    await delivery.save({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Delivery updated successfully", delivery });
  } catch (error) {
    await t.rollback();
    console.error("Error updating delivery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDeliveriesByDriver = async (req, res) => {
  try {
    const { driver_id } = req.query;

    if (!driver_id) {
      return res.status(400).json({ message: "driver_id is required" });
    }

    const deliveries = await Delivery.findAll({
  where: { driver_id },
  include: [
    { model: Orders, attributes: ["order_id", "customer_id", "order_item", "quantity", "price", "status"] },
    { model: Drivers, attributes: ["driver_id", "first_name", "phone_number"] },
    { model: Vehicle, attributes: ["vehicle_id", "vehicle_type","model","make", "plate_number"] },
  ],
  order: [["delivery_date", "DESC"]],
});

    return res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching driver deliveries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a delivery
exports.deleteDelivery = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id, { transaction: t });
    if (!delivery) {
      await t.rollback();
      return res.status(404).json({ message: "Delivery not found" });
    }

    await delivery.destroy({ transaction: t });
    await t.commit();
    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting delivery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
