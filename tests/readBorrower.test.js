const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../main");
const moment = require("moment");

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe("LMS Test Suite - Read Borrower", () => {
  it("should get borrower w/ cardNo = 1", (done) => {
    chai
      .request(server)
      .get("/lms/borrower/user/1")
      .end((err, res) => {
        res.body.should.to.have.property("cardNo");
        res.body.should.to.have.property("name");
        res.body.should.to.have.property("phone");
        res.body.should.to.have.property("address");
        res.should.have.status(200);
        done();
      });
  });

  it("should get borrower w/ cardNo = 1 - XML", (done) => {
    chai
      .request(server)
      .get("/lms/borrower/user/1")
      .set("Accept", "Application/xml")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should get borrower w/ cardNo = 1 - text/plain", (done) => {
    chai
      .request(server)
      .get("/lms/borrower/user/1")
      .set("Accept", "text/plain")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it("should send borrower not found ", (done) => {
    chai
      .request(server)
      .get("/lms/borrower/user/9999")
      .end((err, res) => {
        should.equal(
          res.text,
          "There is no borrower with that card number in our database."
        );
        res.should.have.status(404);
        done();
      });
  });
});
