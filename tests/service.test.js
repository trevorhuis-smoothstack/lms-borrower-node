const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../main");
const moment = require("moment");
const service = require("../service/borrowerService");

const should = chai.should();

chai.use(chaiHttp);

describe("LMS Test Suite - Borrower Service", () => {
  it("should return a borrower", (done) => {
    let loan = {
      bookId: 2,
      branchId: 5,
      cardNo: 6,
      dateOut: "2020-04-24 12:58:05",
    };

    let result = service.readLoan(loan);
    result.should.be.an("Promise");
    done();
  });

  it("should return a borrower", (done) => {
    let result = service.readAllLoans();
    result.should.be.an("Promise");
    done();
  });

  it("should not checkout a book - no branch", (done) => {
    let input = {
      bookId: 2,
      branchId: 5,
      cardNo: 9999,
      dateOut: "2020-04-24 12:58:05",
    };

    let result = service.returnBook(input);
    result.should.be.an("Promise");
    done();
  });

  it("should not checkout a book - no branch", (done) => {
    let input = {
      bookId: 2,
      branchId: 5,
      cardNo: 9999,
      dateOut: "2020-04-24 12:58:05",
    };

    let result = service.checkOutBook(input);
    result.should.be.an("Promise");
    done();
  });

  it("should not checkout a book - no branch", (done) => {
    let input = {
      bookId: 2,
      branchId: 5,
      cardNo: 9999,
      dateOut: "2020-04-24 12:58:05",
    };

    let result = service.checkNumOfCopies(input, 9999);
    result.should.be.an("Promise");
    done();
  });
});
