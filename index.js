const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");
const error = require("./middleware/error");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const auth = require("./routes/auth");
const users = require("./routes/users");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const returns = require("./routes/returns");

const app = express();

require("express-async-errors"); // to wrapp routes in a try-catch block and call next() in the catch

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

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

const db = config.get("db");
mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`).message);

app.use(express.json()); // parse the body of the req in the Request Processing Pipeline
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/rentals", rentals);
app.use("/api/returns", returns);
app.use(error); // realize that the error middleware is the last in the RPP

if (!config.get("jwtPrivateKey")) {
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
}

const port = process.env.PORT || 4000;

module.exports = server = app.listen(port, () => {
  logger.info(`Listening on port ${port}...`);
});
