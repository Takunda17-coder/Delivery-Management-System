// models/customers.model.js
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer", // model name
    {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      sex: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      age: { type: DataTypes.INTEGER, allowNull: true },
      phone_number: { type: DataTypes.STRING, allowNull: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "customers", // lowercase table name
      timestamps: false,
    }
  );

  Customer.associate = (models) => {
    Customer.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
    Customer.hasMany(models.Orders, { foreignKey: "customer_id", as: "orders" });
    Customer.hasMany(models.Invoice, { foreignKey: "customer_id", as: "invoices" });
  };

  return Customer;
};
