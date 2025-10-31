"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if admin exists
    const [admins] = await queryInterface.sequelize.query(
      `SELECT * FROM users WHERE role='admin' LIMIT 1`
    );

    if (admins.length > 0) {
      console.log("✅ Admin already exists. Seeder skipped.");
      return;
    }

    await queryInterface.bulkInsert("users", [
      {
        name: "adminD",
        email: "admind@example.com",
        password: await bcrypt.hash("AdminPass123", 10),
        role: "admin",
        status: "active",
        is_approved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log("✅ Default admin created successfully.");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { role: "admin" });
  },
};
