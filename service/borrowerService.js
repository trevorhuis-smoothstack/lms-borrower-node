const dao = require("../dao/borrowerDAO.js");
const moment = require("moment");

const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

exports.returnBook = (loan, res) => {
  if (
    loan.bookId == undefined ||
    loan.branchId == undefined ||
    loan.cardNo == undefined ||
    loan.dateOut == undefined
  ) {
    res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, cardNo, and the dateOut of a loan to return a book."
      );
    return false;
  }

  dao.getLoan(loan, (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      logger.error(err);
      return;
    }

    // Check if loan exists
    if (result.length < 1) {
      res.status(404).send("We could not find that loan in the database. ");
      return;
    } else if (result.length > 0 && result[0].dateIn !== null) {
      // Check if the book is turned in
      res.status(400).send("That book is already returned. ");
      return;
    }

    loan.dateIn = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    dao.returnBook(loan, (err) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        logger.error(err);
        return;
      }

      res.status(200);
      res.format({
        "application/json": function () {
          res.send(result.message);
        },
        "application/xml": function () {
          res.send(jsontoxml(result.message));
        },
        "text/plain": function () {
          res.send(result.message.toString());
        },
      });
    });
  });
};

exports.checkOutBook = (loan, res) => {
  if (
    loan.bookId == undefined ||
    loan.branchId == undefined ||
    loan.cardNo == undefined
  ) {
    res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, and the cardNo of a loan to check out a book."
      );
    return;
  }

  dao
    .getBorrower(loan.cardNo)
    // Check if borrower exists
    .then((result) => {
      if (result.length > 0) return dao.getBookCopies(loan);
      else res.status(400).send("That card number is not in our database. ");
    })
    // Check if branch has a copy of the book, if so remove one from branch and checkout book.
    .then((result) => {
      if (result.length > 0 && result[0].noOfCopies > 0) {
        loan.dateOut = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
        let dueDate = new Date();
        dueDate = dueDate.setDate(dueDate.getDate() + 7);
        loan.dueDate = moment(dueDate).format("YYYY-MM-DD HH:mm:ss");
        return dao.checkOutBook(loan, result[0].noOfCopies - 1);
      } else
        res
          .status(400)
          .send("There are no copies of that book in our branch.  ");
    })
    // Return the checked out book to the user
    .then((result) => {
      res.status(201);
      res.format({
        "application/json": function () {
          res.send(result.message);
        },
        "application/xml": function () {
          res.send(jsontoxml(result.message));
        },
        "text/plain": function () {
          res.send(result.message.toString());
        },
      });
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error");
      logger.error(err);
      return;
    });
};
