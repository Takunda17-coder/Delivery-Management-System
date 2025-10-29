// server/config/db.config.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pg = require("pg");

const caCert = fs.readFileSync(path.resolve("./config/prod-ca-2021.crt"), "utf8");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: caCert,
    },
  },
  logging: false,
});

module.exports = sequelize;
