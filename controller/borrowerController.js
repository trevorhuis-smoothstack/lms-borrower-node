let routes = require("express").Router();
let dao = require("../dao/borrowerDAO.js");

const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

module.exports = routes;
