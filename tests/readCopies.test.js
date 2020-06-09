const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../main");
const nock = require("nock");
const moment = require("moment");

const should = chai.should();

chai.use(chaiHttp);

describe("LMS Test Suite - Read Copies", () => {
  it("should get a list of book copies", (done) => {
    chai
      .request(server)
      .get("/lms/borrower/copies")
      .end((err, res) => {
        res.body.should.be.an("array");
        res.should.have.status(200);
        done();
      });
  });
});
