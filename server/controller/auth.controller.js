const { Users, Customer } = require("../models"); // singular Customer
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (auto-approved by default)
    const newUser = await Users.create({
      name,
      email,
      phone: phone || null,
      address: address || null,
      password: hashedPassword,
      role,
      is_approved: true, // ✅ approved by default
      status: "active",
    });

    // If the role is customer, create a Customer record
    if (role === "customer") {
      // Split name into first_name and last_name (optional, defaults to empty strings)
      const nameParts = name.trim().split(" ");
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";

      await Customer.create({
        user_id: newUser.id,
        email: email,
        phone_number: phone || null,
        address: address || null,
        first_name,
        last_name,
      });
    }

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.is_approved) return res.status(403).json({ message: "Awaiting admin approval." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign(
      { user_id: user.id, role: user.role },
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
        username: user.name,
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
