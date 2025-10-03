"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        name: "admin1",
        email: "admin1@example.com",
        password: await bcrypt.hash("AdminPass123", 10),
        role: "admin",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "driver1",
        email: "driver1@example.com",
        password: await bcrypt.hash("DriverPass123", 10),
        role: "driver",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "customer1",
        email: "customer1@example.com",
        password: await bcrypt.hash("CustomerPass123", 10),
        role: "customer",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "customer2",
        email: "customer2@example.com",
        password: await bcrypt.hash("CustomerPass456", 10),
        role: "customer",
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
