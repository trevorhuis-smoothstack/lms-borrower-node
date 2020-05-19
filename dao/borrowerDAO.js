let db = require("./db");

exports.getLoan = (loan, cb) => {
  db.query(
    `select * from library.tbl_book_loans where bookId = ${loan.bookId} AND branchId = ${loan.branchId} AND cardNo = ${loan.cardNo} AND dateOut = \'${loan.dateOut}\'`,
    function (err, result) {
      cb(err, result);
    }
  );
};

exports.returnBook = (loan, cb) => {
  db.query(
    `update library.tbl_book_loans SET dateIn = \'${loan.dateIn}\' where bookId = ${loan.bookId} AND branchId = ${loan.branchId} AND cardNo = ${loan.cardNo} AND dateOut = \'${loan.dateOut}\'`,
    function (err, result) {
      cb(err, result);
    }
  );
};

exports.getBookCopies = (bookCopyRef) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from library.tbl_book_copies where bookId = ${bookCopyRef.bookId} AND branchId = ${bookCopyRef.branchId}`,
      function (err, result) {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.getBorrower = (cardNo) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from library.tbl_borrower where cardNo = ${cardNo}`,
      function (err, result) {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.checkOutBook = (loan) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO library.tbl_book_loans (bookId, branchId, cardNo, dateOut, dueDate) VALUES (${loan.bookId}, ${loan.branchId}, ${loan.cardNo}, \'${loan.dateOut}\', \'${loan.dueDate}\')`,
      function (err, result) {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.removeBookFromCopies = (loan, noOfCopies) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE library.tbl_book_copies set noOfCopies = ${noOfCopies} where bookId = ${loan.bookId} and branchId = ${loan.branchId}`,
      function (err, result) {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};
