// server/config/db.config.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pg = require("pg");

let dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false, // works best with Render + Supabase
  },
};

// Load CA cert if present (optional, safer)
const caPath = path.resolve("./config/prod-ca-2021.crt");
if (fs.existsSync(caPath)) {
  const caCert = fs.readFileSync(caPath, "utf8");
  dialectOptions.ssl.ca = caCert;
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions,
  logging: false,
});

module.exports = sequelize;
