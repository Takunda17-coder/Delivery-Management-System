module.exports = (sequelize, DataTypes) => {
    const Device = sequelize.define("Device", {
        device_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        serial_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        last_lat: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
        },
        last_lng: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("Active", "Inactive"),
            defaultValue: "Active",
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "drivers", // Ensure this matches table name
                key: "driver_id",
            },
        },
    }, {
        tableName: "devices", // Explicit table name
    });

    Device.associate = (models) => {
        Device.belongsTo(models.Drivers, { foreignKey: "driver_id", as: "driver" });
    };

    return Device;
};
