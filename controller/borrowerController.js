const routes = require("express").Router();
const service = require("../service/borrowerService.js");
const jsontoxml = require("jsontoxml");

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
    return res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, cardNo, and the dateOut of a loan to return a book."
      );
  }

  service
    .readLoan(req.body)
    .then((result) => {
      if (result.length > 0 && result[0].dateIn !== null) {
        return res.status(400).send("That book is already returned.");
      } else if (result.length < 1) {
        return res
          .status(404)
          .send("We could not find that loan in the resultbase.");
      }
      return service.returnBook(result[0]);
    })
    .then((result) => {
      return res.status(201).send(result);
    })
    .catch((err) => {
      return handleError(res, err);
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
    .readBorrower(req.body.cardNo)
    .then((result) => {
      if (result.length === 0) {
        console.log("reached copies check - 3");
        res
          .status(404)
          .send("There is no borrower with that card number in our database.");
        return;
      } else {
        return service.checkNumOfCopies(req.body);
      }
    })
    .then((data) => {
      if (data.length > 0 && data[0].noOfCopies > 0) {
        return service.checkOutBook(req.body, data[0].noOfCopies - 1);
      } else {
        return res
          .status(400)
          .send("There are no copies of that book in that branch.");
      }
    })
    .then((result) => {
      return res.status(201).send(sendData(res, result));
    })
    .catch((err) => {
      return handleError(res, err);
    });
});

routes.get("/lms/borrower/copies", (req, res) => {
  service
    .readAllCopies()
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .send("There are no copies of books in our database.");
      }

      return res.status(200).send(sendData(res, result));
    })
    .catch((err) => {
      return handleError(res, err);
    });
});

routes.get("/lms/borrower/user/:cardNo", (req, res) => {
  service
    .readBorrower(req.params.cardNo)
    .then((result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .send("There is no borrower with that card number in our database.");
      }

      return res.status(200).send(sendData(res, result));
    })
    .catch((err) => {
      return handleError(res, err);
    });
});

let sendData = (res, result) => {
  res.format({
    "application/json": function () {
      return res.send(result);
    },
    "application/xml": function () {
      return res.send(jsontoxml(result));
    },
    "text/plain": function () {
      return res.send(result.toString());
    },
  });
};

let handleError = (res, err) => {
  logger.error(err);
  return res.status(500).send("Internal server error.");
};

module.exports = routes;
