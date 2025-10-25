// server/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/customers", require("./routes/customers.routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/drivers", require("./routes/drivers.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/vehicles", require("./routes/vehicles.routes"));
app.use("/api/delivery", require("./routes/delivery.routes"));
app.use("/api/invoice", require("./routes/invoice.routes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Delivery & Fleet API is running!" });
});

// ❌ REMOVE app.listen()
// ✅ Just export app
module.exports = app;
