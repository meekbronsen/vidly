const winston = require("winston");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

function logging() {
  process.on("uncaughtException", (ex) => {
    console.log("WE GOT AN UNCAUGHT EXCEPTION");
    logger.error(ex.message);
    process.exit(1);
  });

  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    console.log("WE GOT AN UNHANDLED REJECTION");
    logger.error(ex.message);
    process.exit(1);
  });
}

exports.logger = logger;
exports.logging = logging;
