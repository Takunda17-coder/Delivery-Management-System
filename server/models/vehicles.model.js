// models/vehicles.model.js
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'Vehicle',
    {
      vehicle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      vehicle_type: { type: DataTypes.STRING, allowNull: false },
      make: { type: DataTypes.STRING, allowNull: false },
      model: { type: DataTypes.STRING, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      plate_number: { type: DataTypes.STRING, allowNull: false, unique: true },
      colour: { type: DataTypes.STRING, allowNull: false },
      date_acquired: { type: DataTypes.DATE, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'vehicles',
      timestamps: false,
    }
  );

  // Associations
  Vehicle.associate = (models) => {
    Vehicle.hasMany(models.Delivery, { foreignKey: 'vehicle_id' });
  };

  return Vehicle;
};
