// server/api/index.js
// /api/index.js
const app = require("../index"); // path to your Express app
const serverless = require("serverless-http");

module.exports = serverless(app);

