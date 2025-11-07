const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
// Import models
const Users = require("./users.model")(sequelize, DataTypes);
const Customer = require("./customers.model")(sequelize, DataTypes);
const Orders = require("./orders.model")(sequelize, DataTypes);
const Invoice = require("./invoice.model")(sequelize, DataTypes);
const Drivers = require("./drivers.model")(sequelize, DataTypes);
const Vehicle = require("./vehicles.model")(sequelize, DataTypes);
const Delivery = require("./delivery.model")(sequelize, DataTypes);

// ========================
// FINAL CORRECT ASSOCIATIONS
// ========================

// User ↔ Driver (1:1)
Drivers.belongsTo(Users, { foreignKey: "user_id", as: "user" });
Users.hasOne(Drivers, { foreignKey: "user_id", as: "driverProfile" });

// User ↔ Customer (1:1)
Customer.belongsTo(Users, { foreignKey: "user_id", as: "user" });
Users.hasOne(Customer, { foreignKey: "user_id", as: "customerProfile" });

// Customer ↔ Orders (1:N)
Orders.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Orders, { foreignKey: "customer_id", as: "orders" });

// Order ↔ Delivery (1:1)
Delivery.belongsTo(Orders, { foreignKey: "order_id", as: "order" });
Orders.hasOne(Delivery, { foreignKey: "order_id", as: "delivery" });

// Order ↔ Invoice (1:1)
Invoice.belongsTo(Orders, { foreignKey: "order_id", as: "order" });
Orders.hasOne(Invoice, { foreignKey: "order_id", as: "invoice" });

// Delivery ↔ Invoice (1:1)
Invoice.belongsTo(Delivery, { foreignKey: "delivery_id", as: "delivery" });
Delivery.hasOne(Invoice, { foreignKey: "delivery_id", as: "invoice" });

// Driver ↔ Delivery (1:N)
Delivery.belongsTo(Drivers, { foreignKey: "driver_id", as: "driver" });
Drivers.hasMany(Delivery, { foreignKey: "driver_id", as: "deliveries" });

// Vehicle ↔ Delivery (1:N)
Delivery.belongsTo(Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
Vehicle.hasMany(Delivery, { foreignKey: "vehicle_id", as: "deliveries" });

// Driver ↔ Invoice (1:N)
Invoice.belongsTo(Drivers, { foreignKey: "driver_id", as: "driver" });
Drivers.hasMany(Invoice, { foreignKey: "driver_id", as: "invoices" });

// Vehicle ↔ Invoice (1:N)
Invoice.belongsTo(Vehicle, { foreignKey: "vehicle_id", as: "vehicle" });
Vehicle.hasMany(Invoice, { foreignKey: "vehicle_id", as: "invoices" });

//Invoice ↔ Customer (1:N)
Invoice.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Invoice, { foreignKey: "customer_id", as: "invoices" });

//Driver ↔ Vehicle (1:1)
Vehicle.belongsTo(Drivers, { foreignKey: "driver_id", as: "driver" });
Drivers.hasOne(Vehicle, { foreignKey: "driver_id", as: "vehicle" });

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
