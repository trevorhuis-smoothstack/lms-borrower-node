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
        result = await dao.getLoan(db, loan);
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
      } catch (err) {
        db.rollback(() => {
          reject(err);
        });
        logger.error(err);
      }
      db.commit();
      resolve(result);
    });
  });
};

exports.checkIfBorrowerExists = (cardNo) => {
  let result;
  return new Promise((resolve, reject) => {
    db.beginTransaction(async function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      try {
        result = await dao.getBorrower(db, cardNo);
      } catch (err) {
        logger.error(err);
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
        result = await dao.getBookCopies(db, loan);
      } catch (err) {
        logger.error(err);
        reject(err);
      }
      resolve(result);
    });
  });
};

exports.checkOutBook = (loan, numOfCopies) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction(function (err) {
      if (err) {
        logger.error(err);
        throw err;
      }

      loan.dateOut = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      let dueDate = new Date();
      dueDate = moment(dueDate).add(7, "days");
      loan.dueDate = dueDate.format("YYYY-MM-DD HH:mm:ss");

      dao
        .checkOutBook(db, loan)
        .then(() => {
          return dao.updateNumOfCopies(numOfCopies);
        })
        .catch((err) => {
          db.rollback(() => {
            reject(err);
          });
          logger.error(err);
        });
      db.commit();
      resolve(loan);
    });
  });
};
