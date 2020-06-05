exports.readLoan = (db, loan) => {
  return new Promise((resolve, reject) => {
    db.query(
      "select * from library.tbl_book_loans where bookId = ? AND branchId = ? AND cardNo = ? AND dateOut = ?",
      [loan.bookId, loan.branchId, loan.cardNo, loan.dateOut],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.readLoans = (db) => {
  return new Promise((resolve, reject) => {
    db.query("select * from library.tbl_book_loans ", (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
};

exports.readLoansByBorrower = (db, cardNo) => {
  return new Promise((resolve, reject) => {
    db.query(
      "select * from library.tbl_book_loans where cardNo = ?",
      [cardNo],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.readAllCopies = (db) => {
  return new Promise((resolve, reject) => {
    db.query("select * from library.tbl_book_copies ", (err, result) => {
      return err ? reject(err) : resolve(result);
    });
  });
};

exports.returnBook = (db, loan) => {
  return new Promise((resolve, reject) => {
    db.query(
      "update library.tbl_book_loans SET dateIn = ? where bookId = ? AND branchId = ? AND cardNo = ? AND dateOut = ?",
      [loan.dateIn, loan.bookId, loan.branchId, loan.cardNo, loan.dateOut],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.readBookCopies = (db, bookCopyRef) => {
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

exports.readBorrower = (db, cardNo) => {
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

exports.checkOutBook = (db, loan) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO library.tbl_book_loans (bookId, branchId, cardNo, dateOut, dueDate) VALUES (?, ?, ?, ?, ?)",
      [loan.bookId, loan.branchId, loan.cardNo, loan.dateOut, loan.dueDate],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};

exports.updateNumOfCopies = (db, loan, noOfCopies) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE library.tbl_book_copies set noOfCopies = ? where bookId = ? and branchId = ?",
      [noOfCopies, loan.bookId, loan.branchId],
      (err, result) => {
        return err ? reject(err) : resolve(result);
      }
    );
  });
};
