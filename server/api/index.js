const serverless = require("serverless-http");
const app = require("../index"); // path to your main Express app

module.exports = serverless(app);
