let routes = require("express").Router();
let dao = require("../dao/borrowerDAO.js");

const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

routes.get("/borrower", function (req, res) {
  dao
    .getAllBorrowers()
    .then(function (result) {
      res.setHeader("Content-Type", "application/json");
      res.send(result);
    })
    .catch(function (err) {
      logger.error(err);
    });
});

module.exports = routes;
