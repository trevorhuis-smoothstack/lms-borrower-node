const routes = require("express").Router();
const jsontoxml = require("jsontoxml");
const service = require("../service/borrowerService.js");

const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

routes.put("/lms/borrower/returnBook", (req, res) => {
  if (
    req.body.bookId == undefined ||
    req.body.branchId == undefined ||
    req.body.cardNo == undefined ||
    req.body.dateOut == undefined
  ) {
    res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, cardNo, and the dateOut of a loan to return a book."
      );
    return;
  }

  service
    .readLoan(req.body)
    .then((data) => {
      if (data.length > 0 && data[0].dateIn !== null) {
        res.status(400).send("That book is already returned.");
        return;
      } else if (data.length < 1) {
        res.status(404).send("We could not find that loan in the database. ");
        return;
      }
      service.returnBook(data[0]);
      res.status(201).send("Book Returned!");
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send("Internal Server Error");
    });
});

routes.post("/lms/borrower/checkOutBook", (req, res) => {
  if (
    req.body.bookId == undefined ||
    req.body.branchId == undefined ||
    req.body.cardNo == undefined
  ) {
    res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, and the cardNo to check out a book."
      );
    return;
  }

  service
    .checkIfBorrowerExists(req.body.cardNo)
    .then((data) => {
      if (data.length > 0) {
        return service.checkNumOfCopies(req.body);
      } else {
        res.status(400).send("That card number is not in our database. ");
        return;
      }
    })
    .then((data) => {
      if (data.length > 0 && data[0].noOfCopies > 0) {
        return service.checkOutBook(req.body, data[0].noOfCopies - 1);
      } else {
        res
          .status(400)
          .send("There are no copies of that book in that branch.  ");
        return;
      }
    })
    .then((data) => {
      res.status(201);
      res.format({
        "application/json": function () {
          res.send(data);
        },
        "application/xml": function () {
          res.send(jsontoxml(data));
        },
        "text/plain": function () {
          res.send(data.toString());
        },
      });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = routes;
