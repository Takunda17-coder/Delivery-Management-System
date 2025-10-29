// server/config/db.config.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const pg = require("pg");
require("dotenv").config();

// Read SSL certificate
const caCert = fs.readFileSync(path.resolve("./config/prod-ca-2021.crt"), "utf8");

// Use a global variable to avoid multiple instances in serverless
let sequelize;

if (!global.sequelize) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // still uses your cert for verification
        ca: caCert,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  global.sequelize = sequelize;
} else {
  sequelize = global.sequelize;
}

module.exports = sequelize;
