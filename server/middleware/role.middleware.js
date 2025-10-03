const auth = require("../middleware/auth");          // JWT validation
const authorize = require("../middleware/authorize"); // Role check

// Only admin can create vehicles
app.post("/api/vehicles", auth, authorize("admin"), (req, res) => {
  res.json({ message: "Vehicle created by admin" });
});

// Dispatcher and admin can assign deliveries
app.post("/api/assignments", auth, authorize("dispatcher", "admin"), (req, res) => {
  res.json({ message: "Delivery assignment created" });
});

// Drivers can only view their own deliveries
app.get("/api/my-deliveries", auth, authorize("driver"), (req, res) => {
  res.json({ message: "Driver deliveries" });
});
