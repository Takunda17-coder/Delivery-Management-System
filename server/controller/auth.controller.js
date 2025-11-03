const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users, Customer } = require("../models"); // import Customer singular

// Register User + auto create Customer
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if email already exists in Users
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Users.create({
      email,
      password: hashedPassword,
      role: "customer", 
    });

    // Create Customer with same email + linked user_id
    await Customer.create({
      email,
      user_id: newUser.user_id,
      first_name: null,
      last_name: null,
      sex: null,
      address: null,
      age: null,
      phone_number: null,
    });

    res.status(201).json({ message: "User registered successfully", user_id: newUser.user_id });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
