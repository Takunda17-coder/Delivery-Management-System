const { Users, Customer } = require("../models"); // singular Customer
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  try {
    // Check if email exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",       // auto-approve
      is_approved: true,      // auto-approve
    });

    // If the user is a customer, create corresponding customer record
    if (role === "customer") {
      const nameParts = name.trim().split(" ");
      const first_name = nameParts[0] || "First";
      const last_name = nameParts.slice(1).join(" ") || "Last";

      await Customer.create({
        user_id: newUser.user_id,  // ✅ must match Users PK
        email,
        phone_number: phone || null,
        address: address || null,
        first_name,
        last_name,
      });
    }

    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
