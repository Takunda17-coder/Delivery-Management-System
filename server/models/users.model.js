module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true  // auto-approve by default
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return Users;
};
