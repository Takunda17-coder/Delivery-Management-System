const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    if (!name || !email || !phone || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await db.Users.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.Users.create({
      username: name,        // map name → username
      email,
      password: hash,
      role: "customer",      // auto-assign customer role
      status: "active",
      phone,                 // make sure your User model has phone & address columns
      address,
      is_approved: true
    });

    res.status(201).json({ message: "Customer created successfully", user_id: newUser.id });
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
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h"
    });

    // Update last login timestamp
    await user.update({ last_login: new Date() });

    // Send safe user info (no password)
    res.status(200).json({
      token,
      user: {
        user_id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
