// controllers/delivery.controller.js
const { sequelize, Delivery, Orders, Drivers, Vehicle } = require("../models");


// ---------------------------- CREATE DELIVERY ----------------------------
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
      status,
      recipient_name,
      recipient_contact,
    } = req.body;

    // ✅ Validate required fields
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
      !priority ||
      !recipient_name ||
      !recipient_contact
    ) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // ✅ Check if related entities exist
    const [order, driver, vehicle] = await Promise.all([
      Orders.findByPk(order_id, { transaction: t }),
      Drivers.findByPk(driver_id, { transaction: t }),
      Vehicle.findByPk(vehicle_id, { transaction: t }),
    ]);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // ✅ Valid ENUMs
    const validStatus = ["Scheduled", "On Route", "Completed", "Cancelled"];
    const validPriority = ["High", "Medium", "Low"];

    const finalStatus = validStatus.includes(status) ? status : "Scheduled";
    const finalPriority = validPriority.includes(priority) ? priority : "Low";

    // ✅ Create Delivery
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
        status: finalStatus,
        priority: finalPriority,
        recipient_name,
        recipient_contact,
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

// ---------------------------- GET ALL DELIVERIES ----------------------------
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [{ model: Orders }, { model: Drivers }, { model: Vehicle }],
    });
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------------- GET DELIVERY BY ID ----------------------------
exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id, {
      include: [{ model: Orders }, { model: Drivers }, { model: Vehicle }],
    });

    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching delivery:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------------- UPDATE DELIVERY ----------------------------
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

    // ✅ ENUM validation
    const validStatus = ["Scheduled", "On Route", "Completed", "Cancelled"];
    const validPriority = ["High", "Medium", "Low"];

    if (updates.status && !validStatus.includes(updates.status)) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (updates.priority && !validPriority.includes(updates.priority)) {
      await t.rollback();
      return res.status(400).json({ message: "Invalid priority value" });
    }

    // ✅ Apply updates
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

// ---------------------------- GET DELIVERIES BY DRIVER ----------------------------
exports.getDeliveriesByDriver = async (req, res) => {
  try {
    const { driver_id } = req.query;
    if (!driver_id) return res.status(400).json({ message: "driver_id is required" });

    const deliveries = await Delivery.findAll({
      where: { driver_id: Number(driver_id) },
      include: [
        {
          model: Orders,
          attributes: ["order_id", "customer_id", "order_item", "quantity", "price", "status"],
        },
        { model: Drivers, attributes: ["driver_id", "first_name", "phone_number"] },
        { model: Vehicle, attributes: ["vehicle_id", "vehicle_type", "model", "make", "plate_number"] },
      ],
      order: [["delivery_date", "DESC"]],
    });

    res.status(200).json(deliveries || []);
  } catch (error) {
    console.error("Error fetching driver deliveries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------------- GET DELIVERIES BY CUSTOMER ----------------------------
exports.getDeliveriesByCustomer = async (req, res) => {
  try {
    const { customer_id } = req.query;
    if (!customer_id) return res.status(400).json({ message: "customer_id is required" });

    const deliveries = await Delivery.findAll({
      include: [
        { model: Orders,as: "order", where: { customer_id }, attributes: ["order_id", "order_item", "status"] },
        { model: Drivers,as:"driver", attributes: ["driver_id", "first_name", "phone_number"] },
        { model: Vehicle,as:"vehicle", attributes: ["vehicle_id", "vehicle_type", "model", "plate_number"] },
      ],
      order: [["delivery_date", "DESC"]],
    });

    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching customer deliveries:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ---------------------------- DELETE DELIVERY ----------------------------
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
