// models/orders.model.js
module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define(
    "Orders", // model name
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customers", // lowercase table name
          key: "customer_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      order_item: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      pickup_address: { type: DataTypes.STRING, allowNull: false },
      total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "Scheduled",
          "Completed",
          "Cancelled",
        ),
        allowNull: false,
        defaultValue: "Pending",
      },
      weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      tableName: "orders", // lowercase table name
      timestamps: true,
    }
  );

  Orders.associate = (models) => {
    Orders.belongsTo(models.Customer, {
      foreignKey: "customer_id",
      as: "customer",
    });
    Orders.hasMany(models.Delivery, {
      foreignKey: "order_id",
      as: "deliveries",
    });
    Orders.hasMany(models.Invoice, { foreignKey: "order_id", as: "invoices" });
  };

  return Orders;
};
