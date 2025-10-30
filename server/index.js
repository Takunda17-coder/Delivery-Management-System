const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/db.config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you use cookies
}));

// Routes
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/customers", require("./routes/customers.routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/drivers", require("./routes/drivers.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/vehicles", require("./routes/vehicles.routes"));
app.use("/api/delivery", require("./routes/delivery.routes"));
app.use("/api/invoice", require("./routes/invoice.routes"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "🚀 API is running on Render!" });
});

// DB connect
sequelize.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database error:", err.message));

// ✅ Only listen if not Vercel (Render requires this)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

module.exports = app;
