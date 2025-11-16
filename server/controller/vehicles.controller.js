// controllers/vehicles.controller.js
const { Vehicle, Drivers, sequelize } = require("../models");

/**
 * Create a new vehicle and optionally link it to a driver
 */
exports.createVehicle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      vehicle_type,
      make,
      model,
      year,
      plate_number,
      colour,
      date_acquired,
      capacity,
      status,
      driver_id, // optional
    } = req.body;

    // Validate required fields
    if (!vehicle_type || !make || !model || !year || !plate_number || !colour || !date_acquired || !capacity) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Check for existing plate number
    const existing = await Vehicle.findOne({ where: { plate_number }, transaction: t });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ message: "Vehicle with this plate number already exists" });
    }

    // Optional: validate driver
    if (driver_id) {
      const driver = await Drivers.findByPk(driver_id, { transaction: t });
      if (!driver) {
        await t.rollback();
        return res.status(404).json({ message: "Driver not found" });
      }
    }

    // Create vehicle
    const newVehicle = await Vehicle.create(
      {
        vehicle_type,
        make,
        model,
        year,
        plate_number,
        colour,
        date_acquired,
        capacity,
        status: status || "Active",
        driver_id: driver_id || null,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ message: "Vehicle created successfully", vehicle: newVehicle });
  } catch (error) {
    await t.rollback();
    console.error("Error creating vehicle:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all vehicle (with linked driver info)
 */
exports.getAllVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      include: [
        {
          model: Drivers,
          as: "driver",
          attributes: ["driver_id", "first_name", "last_name", "phone_number", "status"],
        },
      ],
    });
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get vehicle by ID
 */
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByPk(id, {
      include: [
        {
          model: Drivers,
          as: "driver",
          attributes: ["driver_id", "first_name", "last_name", "phone_number", "status"]
        },
      ],
    });

    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update vehicle
 */
exports.updateVehicle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { plate_number, model, make, year, capacity, status, driver_id } = req.body;

    const vehicle = await Vehicle.findByPk(id, { transaction: t });
    if (!vehicle) {
      await t.rollback();
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // If changing plate_number, ensure it's unique
    if (plate_number && plate_number !== vehicle.plate_number) {
      const exists = await Vehicle.findOne({ where: { plate_number }, transaction: t });
      if (exists) {
        await t.rollback();
        return res.status(400).json({ message: "Another vehicle with this plate_number exists" });
      }
      vehicle.plate_number = plate_number;
    }

    // If linking to a driver, check existence
    if (driver_id) {
      const driver = await Drivers.findByPk(driver_id, { transaction: t });
      if (!driver) {
        await t.rollback();
        return res.status(404).json({ message: "Driver not found for driver_id" });
      }
      vehicle.driver_id = driver_id;
    } else if (driver_id === null) {
      vehicle.driver_id = null; // unassign driver
    }

    vehicle.vehicle_type = req.body.vehicle_type ?? vehicle.vehicle_type;
    vehicle.make = req.body.make ?? vehicle.make;
    vehicle.model = req.body.model ?? vehicle.model;
    vehicle.year = req.body.year ?? vehicle.year;
    vehicle.colour = req.body.colour ?? vehicle.colour;
    vehicle.date_acquired = req.body.date_acquired ?? vehicle.date_acquired;
    vehicle.capacity = req.body.capacity ?? vehicle.capacity;
    vehicle.status = req.body.status ?? vehicle.status;


    await vehicle.save({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Vehicle updated successfully", vehicle });
  } catch (error) {
    await t.rollback();
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete vehicle
 */
exports.deleteVehicle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id, { transaction: t });
    if (!vehicle) {
      await t.rollback();
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Server error" });
  }
};
