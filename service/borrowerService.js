const dao = require("../dao/borrowerDAO");
const moment = require("moment");
const db = require("../dao/db");

const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

exports.readLoan = (loan) => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.readLoan(db, loan);
      } catch (err) {
        reject(err);
        logger.error(err);
      }
      resolve(result);
    });
  });
};

exports.readAllLoans = () => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.readLoan(db);
      } catch (err) {
        reject(err);
        logger.error(err);
      }
      resolve(result);
    });
  });
};

exports.readAllCopies = () => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.readAllCopies(db);
      } catch (err) {
        reject(err);
        logger.error(err);
      }
      resolve(result);
    });
  });
};

exports.returnBook = (loan) => {
  loan.dateIn = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.returnBook(db, loan);
        bookCopies = await dao.readBookCopies(db, loan);
        await dao.updateNumOfCopies(db, loan, bookCopies[0].noOfCopies + 1);
      } catch (err) {
        db.rollback(() => {
          reject(err);
        });
        logger.error(err);
      }
      db.commit();
      resolve(loan);
    });
  });
};

exports.readBorrower = (cardNo) => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.readBorrower(db, cardNo);
      } catch (err) {
        logger.error(err);
        reject(err);
      }

      try {
        loansResult = await dao.readLoansByBorrower(db, cardNo);

        if (result.length > 0) {
          result = result[0];
          result.loans = [];

          loansResult.forEach((val) => {
            result.loans.push(val);
          });
        }
      } catch (err) {
        console.log("Error in read borrower");
        logger.err(err);
        reject(err);
      }

      resolve(result);
    });
  });
};

exports.checkNumOfCopies = (loan) => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.readBookCopies(db, loan);
      } catch (err) {
        logger.error(err);
        reject(err);
      }
      resolve(result);
    });
  });
};

exports.checkOutBook = (loan, numOfCopies) => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) {
        logger.error(err);
        throw err;
      }

      loan.dateOut = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      let dueDate = new Date();
      dueDate = moment(dueDate).add(7, "days");
      loan.dueDate = dueDate.format("YYYY-MM-DD HH:mm:ss");

      try {
        result = await dao.checkOutBook(db, loan);
        await dao.updateNumOfCopies(db, loan, numOfCopies);
      } catch (err) {
        db.rollback(() => {
          reject(err);
        });
        logger.error(err);
      }
      db.commit();
      resolve(loan);
    });
  });
};
