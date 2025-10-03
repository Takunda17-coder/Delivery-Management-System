const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false, // set to console.log for debugging
  }
);

// Import models
const Users = require("./users.model")(sequelize, DataTypes);
const Customer = require("./customers.model")(sequelize, DataTypes);
const Orders = require("./orders.model")(sequelize, DataTypes);
const Invoice = require("./invoice.model")(sequelize, DataTypes);
const Drivers = require("./drivers.model")(sequelize, DataTypes);
const Vehicle = require("./vehicles.model")(sequelize, DataTypes);
const Delivery = require("./delivery.model")(sequelize, DataTypes);

// ========================
// Define Associations
// ========================

// Users ↔ Customer
Customer.belongsTo(Users, { foreignKey: "user_id", as: "user" });
Users.hasOne(Customer, { foreignKey: "user_id", as: "customerProfile" });

// Users ↔ Drivers
Drivers.belongsTo(Users, { foreignKey: "user_id", as: "user" });
Users.hasMany(Drivers, { foreignKey: "user_id", as: "drivers" });

// Customer ↔ Orders
Orders.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Orders, { foreignKey: "customer_id", as: "orders" });

// Customer ↔ Invoice
Invoice.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Invoice, { foreignKey: "customer_id", as: "invoices" });

// Orders ↔ Delivery
Delivery.belongsTo(Orders, { foreignKey: "order_id", as: "order" });
Orders.hasMany(Delivery, { foreignKey: "order_id", as: "deliveries" });

// Orders ↔ Invoice
Invoice.belongsTo(Orders, { foreignKey: "order_id", as: "order" });
Orders.hasMany(Invoice, { foreignKey: "order_id", as: "invoices" });

// Drivers ↔ Delivery
Delivery.belongsTo(Drivers, { foreignKey: "driver_id", as: "driver" });
Drivers.hasMany(Delivery, { foreignKey: "driver_id", as: "deliveries" });

// Drivers ↔ Invoice
Invoice.belongsTo(Drivers, { foreignKey: "driver_id", as: "driver" });
Drivers.hasMany(Invoice, { foreignKey: "driver_id", as: "invoices" });

// Vehicle ↔ Delivery
Delivery.belongsTo(Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
Vehicle.hasMany(Delivery, { foreignKey: "vehicle_id", as: "deliveries" });

// Vehicle ↔ Drivers
Drivers.belongsTo(Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
Vehicle.hasMany(Drivers, { foreignKey: "vehicle_id", as: "drivers" });

//Invoice ↔ Vehicle
Invoice.belongsTo(Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
Vehicle.hasMany(Invoice, { foreignKey: "vehicle_id", as: "invoices" });

//Delivery ↔ Invoice
Invoice.belongsTo(Delivery, { foreignKey: "delivery_id", as: "delivery" });
Delivery.hasMany(Invoice, { foreignKey: "delivery_id", as: "invoices" });


// ========================
// Sync all tables
// ========================

(async () => {
  try {
    // Use { force: true } only in development to drop and recreate tables
    await sequelize.sync({ alter: true });
    console.log("✅ All tables created or updated successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  }
})();

// Export models and sequelize
module.exports = {
  sequelize,
  Users,
  Customer,
  Orders,
  Invoice,
  Drivers,
  Vehicle,
  Delivery,
};
