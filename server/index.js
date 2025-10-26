const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db.config");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/customers", require("./routes/customers.routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/drivers", require("./routes/drivers.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/vehicles", require("./routes/vehicles.routes"));
app.use("/api/delivery", require("./routes/delivery.routes"));
app.use("/api/invoice", require("./routes/invoice.routes"));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 API is running!" });
});

// ✅ Test DB connection (non-fatal)
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database error:", err.message));

// Start the server
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`✅ Server is running on http://localhost:${PORT}`);
// });

module.exports = app;
