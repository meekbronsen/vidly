const winston = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logfile.log" }), 
  ]
});

function error (err, req, res) {
  logger.error(err.message)
  return res.status(404).send("Something failed");
};

module.exports = error