// models/drivers.model.js
module.exports = (sequelize, DataTypes) => {
  const Drivers = sequelize.define(
    'Drivers',
    {
      driver_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },
      sex: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      phone_number: { type: DataTypes.STRING, allowNull: false, unique: true },
      license_number: { type: DataTypes.STRING, allowNull: false, unique: true },
      license_qualification: { type: DataTypes.STRING, allowNull: false },
      license_expiry: { type: DataTypes.DATE, allowNull: false },
      vehicle_type: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.STRING, defaultValue: 'active' },
      date_joined: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'drivers',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );




  Drivers.associate = (models) => {
    // Each driver belongs to one user
    Drivers.belongsTo(models.User, { foreignKey: 'user_id' });
    Drivers.hasMany(Invoice, { foreignKey: 'driver_id', as: 'invoices' });
  };

  return Drivers;
};
