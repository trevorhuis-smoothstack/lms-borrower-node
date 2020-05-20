let routes = require("express").Router();
let service = require("../service/borrowerService.js");

routes.put("/lms/borrower/returnBook", (req, res) => {
  service.returnBook(req.body, res);
});

routes.post("/lms/borrower/checkOutBook", (req, res) => {
  service.checkOutBook(req.body, res);
});

module.exports = routes;
