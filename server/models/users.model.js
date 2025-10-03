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
    status: DataTypes.STRING
  }, {
    tableName: 'users',   // exact table name
    timestamps: true
  });

  return Users;
};
