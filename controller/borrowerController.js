let routes = require("express").Router();
let service = require("../service/borrowerService.js");

routes.put("/lms/borrower/returnBook", (req, res) => {
  let body = req.body;
  let goodReq = checkLoanReturnBody(body, res);
  if (!goodReq) return;

  service.returnBook(body, res);
});

routes.post("/lms/borrower/checkOutBook", (req, res) => {
  let body = req.body;
  let goodReq = checkLoanCheckOutBody(body, res);
  if (!goodReq) return;

  service.checkOutBook(body, res);
});

module.exports = routes;

let checkLoanReturnBody = (body, res) => {
  if (
    body.bookId == undefined ||
    body.branchId == undefined ||
    body.cardNo == undefined ||
    body.dateOut == undefined
  ) {
    res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, cardNo, and the dateOut of a loan to return a book."
      );
    return false;
  }

  return true;
};

let checkLoanCheckOutBody = (body, res) => {
  if (
    body.bookId == undefined ||
    body.branchId == undefined ||
    body.cardNo == undefined
  ) {
    res
      .status(400)
      .send(
        "Bad Request: We require the bookId, branchId, and the cardNo of a loan to check out a book."
      );
    return false;
  }

  return true;
};
