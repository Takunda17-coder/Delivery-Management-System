// server/config/db.config.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const pg = require("pg");
require("dotenv").config();

// Read SSL certificate for Supabase
const caCert = fs.readFileSync(path.resolve("./config/prod-ca-2021.crt"), "utf8");

// Use a global variable to avoid creating multiple instances in serverless environments
let sequelize;

if (!global.sequelize) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectModule: pg,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // still checks cert, prevents self-signed errors
        ca: caCert,
      },
    },
    pool: {
      max: 5,       // max connections
      min: 0,       // min connections
      acquire: 30000, // max time to acquire a connection
      idle: 10000,    // idle time before releasing
    },
    // Optional: timeout to prevent Vercel cold start issues
    retry: {
      match: [/ETIMEDOUT/, /EHOSTUNREACH/, /ECONNRESET/],
      max: 3, // retry 3 times
    },
  });

  global.sequelize = sequelize;
} else {
  sequelize = global.sequelize;
}

module.exports = sequelize;
