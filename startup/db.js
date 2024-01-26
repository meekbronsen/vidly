const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

module.exports = function () {
  const db = config.get("db");
  return mongoose
    .connect(db)
    .then(() => logger.info(`Connected to ${db}...`).message);
};
