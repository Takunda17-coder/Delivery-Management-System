const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    if (!name || !email || !phone || !address || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["customer", "driver"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'customer' or 'driver'" });
    }

    // Check if email already exists
    const existing = await db.Users.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.Users.create({
      username: name,
      email,
      password: hash,
      role,
      status: "active",
      phone,
      address,
      is_approved: true,
    });

    // Auto-create Customer or Driver entry
    if (role === "customer") {
      await db.Customer.create({
        user_id: newUser.user_id, // match your Users table PK
        name,
        email,
        phone,
        address,
      });
    } else if (role === "driver") {
      await db.Drivers.create({
        user_id: newUser.user_id,
        name,
        email,
        phone,
        address,
        status: "active",
      });
    }

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user_id: newUser.user_id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.Users.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.is_approved) return res.status(403).json({ message: "Awaiting admin approval." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Update last login timestamp
    await user.update({ last_login: new Date() });

    // Send safe user info
    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
