// models/invoice.model.js
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      invoice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: { type: DataTypes.INTEGER, allowNull: false },
      order_id: { type: DataTypes.INTEGER, allowNull: false },
      delivery_id: { type: DataTypes.INTEGER, allowNull: false },
      driver_id: { type: DataTypes.INTEGER, allowNull: false },
      vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
      order_items: { type: DataTypes.TEXT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      delivery_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM("Paid","Unpaid"),
        allowNull: false,
        defaultValue: "Unpaid",
      },
      issue_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "invoices",
      timestamps: true,
    }
  );

  // Associations
  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Customers, { foreignKey: "customer_id" });
    Invoice.belongsTo(models.Orders, { foreignKey: "order_id" });
    Invoice.belongsTo(models.Delivery, { foreignKey: "delivery_id" });
    Invoice.belongsTo(models.Drivers, { foreignKey: "driver_id" });
    Invoice.belongsTo(models.Vehicles, { foreignKey: "vehicle_id" });
  };

  return Invoice;
};
