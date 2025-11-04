// controllers/drivers.controller.js
const { Users, Drivers, sequelize } = require("../models");
const bcrypt = require("bcrypt");

/**
 * Create a new driver (and linked user)
 */
exports.createDriver = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      sex,
      phone_number,
      license_number,
      license_qualification,
      license_expiry,
      vehicle_type,
      date_joined,
      status,
      password, // optional
    } = req.body;

    // Validate required fields
    if (
      !first_name ||
      !last_name ||
      !email ||
      !age ||
      !sex ||
      !phone_number ||
      !license_number ||
      !license_qualification ||
      !license_expiry ||
      !vehicle_type ||
      !date_joined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await Users.findOne({ where: { email }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password or generate random
    const rawPassword = password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create User
    const newUser = await Users.create(
      {
        name: `${first_name} ${last_name}`,
        email,
        password: hashedPassword,
        role: "driver",
        status: "active",
      },
      { transaction: t }
    );

    // Create Driver, using newUser.user_id
    const newDriver = await Drivers.create(
      {
        user_id: newUser.user_id, // <-- important fix
        first_name,
        last_name,
        age,
        sex,
        email,
        phone_number,
        license_number,
        license_qualification,
        license_expiry,
        vehicle_type,
        date_joined,
        status: status || "active",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: "Driver created successfully",
      driver: newDriver,
      generatedPassword: password ? undefined : rawPassword,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all drivers (with linked user info)
 */
exports.getAllDrivers = async (_req, res) => {
  try {
    const drivers = await Drivers.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["user_id", "name", "email", "role", "status"], // hide password
        },
      ],
    });
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get a single driver by ID
 */
exports.getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Drivers.findByPk(id, {
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["user_id", "name", "email", "role", "status"],
        },
      ],
    });

    if (!driver) return res.status(404).json({ message: "Driver not found" });

    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};




/**
 * Update driver + linked user
 */
exports.updateDriver = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      age,
      sex,
      phone_number,
      license_number,
      license_qualification,
      license_expiry,
      vehicle_type,
      date_joined,
      status,
      password,
    } = req.body;

    const driver = await Drivers.findByPk(id, { transaction: t });
    if (!driver) {
      await t.rollback();
      return res.status(404).json({ message: "Driver not found" });
    }

    const user = await Users.findByPk(driver.user_id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Linked user not found" });
    }

    // --- Update email if changed ---
    if (email && email !== user.email) {
      const emailExists = await Users.findOne({ where: { email }, transaction: t });
      if (emailExists) {
        await t.rollback();
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
      driver.email = email;
    }

    // --- Update password if provided ---
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save({ transaction: t });

    // --- Update driver fields ---
    driver.first_name = first_name || driver.first_name;
    driver.last_name = last_name || driver.last_name;
    driver.age = age || driver.age;
    driver.sex = sex || driver.sex;
    driver.phone_number = phone_number || driver.phone_number;
    driver.license_number = license_number || driver.license_number;
    driver.license_qualification = license_qualification || driver.license_qualification;
    driver.license_expiry = license_expiry || driver.license_expiry;
    driver.vehicle_type = vehicle_type || driver.vehicle_type;
    driver.date_joined = date_joined || driver.date_joined;
    driver.status = status || driver.status;

    await driver.save({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Driver updated successfully", driver });
  } catch (error) {
    await t.rollback();
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete driver + linked user
 */
exports.deleteDriver = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const driver = await Drivers.findByPk(id, { transaction: t });
    if (!driver) {
      await t.rollback();
      return res.status(404).json({ message: "Driver not found" });
    }

    const user = await Users.findByPk(driver.user_id, { transaction: t });
    if (user) {
      await user.destroy({ transaction: t });
    }

    await driver.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};
