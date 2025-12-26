module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define("Delivery", {
    delivery_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    driver_id: { type: DataTypes.INTEGER, allowNull: false },
    vehicle_id: { type: DataTypes.INTEGER, allowNull: false },
    pickup_address: { type: DataTypes.STRING, allowNull: false },
    dropoff_address: { type: DataTypes.STRING, allowNull: false },
    pickup_lat: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    pickup_lng: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    dropoff_lat: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    dropoff_lng: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    current_lat: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
    current_lng: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
    route_polyline: { type: DataTypes.TEXT, allowNull: true },
    delivery_date: { type: DataTypes.DATE, allowNull: false },
    expected_delivery_time: { type: DataTypes.TIME, allowNull: false },
    status: { type: DataTypes.ENUM("Scheduled","On Route","Completed","Cancelled"), defaultValue: "Scheduled" },
    delivery_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    priority: { type: DataTypes.ENUM("High","Medium","Low"), defaultValue: "Low" },
    recipient_name: { type: DataTypes.STRING, allowNull: false },
    recipient_contact: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: "delivery",
    timestamps: false,
  });

  return Delivery;
};
