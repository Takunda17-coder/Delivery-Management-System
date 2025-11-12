module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define("Delivery", {
    delivery_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    driver_id: { type: DataTypes.INTEGER, allowNull: false },
    vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
    pickup_address: { type: DataTypes.STRING, allowNull: false },
    dropoff_address: { type: DataTypes.STRING, allowNull: false },
    delivery_date: { type: DataTypes.DATE, allowNull: false },
    expected_delivery_time: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "scheduled" },
    delivery_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    priority: { type: DataTypes.ENUM("High","Medium","Low"), defaultValue: "low" },
    recipient_name: { type: DataTypes.STRING, allowNull: false },
    recipient_contact: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: "delivery",
    timestamps: false,
  });

  return Delivery;
};
