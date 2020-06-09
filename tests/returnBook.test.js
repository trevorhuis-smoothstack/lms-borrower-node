const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../main");
const nock = require("nock");
const moment = require("moment");

const should = chai.should();

chai.use(chaiHttp);

describe("LMS Test Suite - Return Book", () => {
  it("should not return a book - no cardNo", (done) => {
    let input = {
      bookId: 2,
      branchId: 5,
      dateOut: "2020-04-24 12:58:05",
    };

    chai
      .request(server)
      .put("/lms/borrower/returnBook")
      .send(input)
      .end((err, res) => {
        should.equal(
          res.text,
          "Bad Request: We require the bookId, branchId, cardNo, and the dateOut of a loan to return a book."
        );
        res.should.have.status(400);
        done();
      });
  });

  it("should not return a book - no loan found", (done) => {
    let input = {
      bookId: 2,
      branchId: 5,
      cardNo: 9999,
      dateOut: "2020-04-24 12:58:05",
    };

    chai
      .request(server)
      .put("/lms/borrower/returnBook")
      .send(input)
      .end((err, res) => {
        should.equal(
          res.text,
          "We could not find that loan in the resultbase."
        );
        res.should.have.status(404);
        done();
      });
  });
});
