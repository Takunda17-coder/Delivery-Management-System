const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Users, sequelize } = require("./models"); // ✅ correct import

const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socketHandler");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

app.use(express.json());
app.use(
  cors({
    origin: "*", // Accept all origins (frontend can be deployed anywhere)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // Set to false for wildcard origin
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

// ✅ Auto create default admin
async function createDefaultAdmin() {
  try {
    const existingAdmin = await Users.findOne({ where: { role: "admin" } });

    if (existingAdmin) {
      console.log("✅ Admin account already exists. Skipping seeding.");
      return;
    }

    const hashedPassword = await bcrypt.hash("AdminPass123", 10);

    await Users.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
      is_approved: true,
    });

    console.log("🎉 Default admin created: admin@example.com | AdminPass123");
  } catch (error) {
    console.error("❌ Failed to create default admin:", error);
  }
}

// ✅ Connect DB, sync models, then create admin, then start server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");
    return sequelize.sync(); // ensures tables exist
  })
  .then(async () => {
    console.log("✅ Tables synced");
    await createDefaultAdmin(); // <-- Admin created here
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Database error:", err.message));

module.exports = app;
