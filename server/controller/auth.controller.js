const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, password, email, role, status } = req.body;

    // Check if email already exists
    const existing = await db.User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user (let DB handle ID auto-gen)
    const newUser = await db.User.create({
      username,
      password: hash, // ✅ save hashed password
      email,
      role: role || "user", // default role
      status: status || "active",
      is_approved: role === "customer" ? true : false // auto-approve customers
    });

    res.status(201).json({ message: "User created successfully", user_id: newUser.id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });

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
