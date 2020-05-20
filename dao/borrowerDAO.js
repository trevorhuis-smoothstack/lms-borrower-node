let db = require("./db");

exports.getLoan = (loan, cb) => {
  db.query(
    "select * from library.tbl_book_loans where bookId = ? AND branchId = ? AND cardNo = ? AND dateOut = ?",
    [loan.bookId, loan.branchId, loan.cardNo, loan.dateOut],
    (err, result) => {
      cb(err, result);
    }
  );
};

exports.returnBook = (loan, cb) => {
  db.query(
    "update library.tbl_book_loans SET dateIn = ? where bookId = ? AND branchId = ? AND cardNo = ? AND dateOut = ?",
    [loan.dateIn, loan.bookId, loan.branchId, loan.cardNo, loan.dateOut],
    (err, result) => {
      if (err) {
        db.rollback(() => {
          cb(err, result);
        });
      }
      db.commit((err, result) => {
        cb(err, result);
      });
    }
  );
};

exports.getBookCopies = (bookCopyRef) => {
  return new Promise((resolve, reject) => {
    db.query(
      "select * from library.tbl_book_copies where bookId = ? AND branchId = ?",
      [bookCopyRef.bookId, bookCopyRef.branchId],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.getBorrower = (cardNo) => {
  return new Promise((resolve, reject) => {
    db.query(
      "select * from library.tbl_borrower where cardNo = ?",
      [cardNo],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.checkOutBook = (loan, noOfCopies) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction(function (err) {
      if (err) {
        reject(err);
      }

      db.query(
        "INSERT INTO library.tbl_book_loans (bookId, branchId, cardNo, dateOut, dueDate) VALUES (?, ?, ?, ?, ?)",
        [loan.bookId, loan.branchId, loan.cardNo, loan.dateOut, loan.dueDate],
        (err, result) => {
          if (err) {
            db.rollback(function () {
              reject(err);
            });
          }

          db.query(
            "UPDATE library.tbl_book_copies set noOfCopies = ? where bookId = ? and branchId = ?",
            [noOfCopies, loan.bookId, loan.branchId],
            (err, result) => {
              if (err) {
                db.rollback(function () {
                  reject(err);
                });
              }
              db.commit(function (err) {
                if (err) {
                  db.rollback(function () {
                    reject(err);
                  });
                }
                db.end();
                resolve(result);
              });
            }
          );
        }
      );
    });
  });
};
