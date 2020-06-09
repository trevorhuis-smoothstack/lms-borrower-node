const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../main");
const moment = require("moment");

const should = chai.should();

chai.use(chaiHttp);

describe("LMS Test Suite - Check Out Book", () => {
  it("should not checkout a book - bad borrower", (done) => {
    let checkOutInput = {
      bookId: 2,
      branchId: 5,
      cardNo: 9999,
    };
    chai
      .request(server)
      .post("/lms/borrower/checkOutBook")
      .send(checkOutInput)
      .end((err, res) => {
        should.equal(
          res.text,
          "There is no borrower with that card number in our database."
        );
        res.should.have.status(404);
        done();
      });
  });

  it("should not checkout a book - no branch", (done) => {
    let checkOutInput = {
      bookId: 2,
      cardNo: 9999,
    };
    chai
      .request(server)
      .post("/lms/borrower/checkOutBook")
      .send(checkOutInput)
      .end((err, res) => {
        should.equal(
          res.text,
          "Bad Request: We require the bookId, branchId, and the cardNo to check out a book."
        );
        res.should.have.status(400);
        done();
      });
  });
});
