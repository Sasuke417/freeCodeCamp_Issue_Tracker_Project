const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');
let newId = new mongoose.mongo.ObjectId('56cb91bdc3464f14678934ca');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let ex1 = "";
  let ex2 = "";
  //POST Tests
  suite("POST => /api/issues/{project}", function() {
    
    test("Only required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/apitest2")
        .send({
          issue_title: "test_title2",
          issue_text: "test_text2",
          created_by: "chai2",
          assigned_to: "",
          status_text: ""
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "test_title2");
          assert.equal(res.body.issue_text, "test_text2");
          assert.equal(res.body.created_by, "chai2");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.project, "apitest2");
          ex2 = res.body._id;
          done();
        });
    });
    test("Every field", function(done) {
        chai
          .request(server)
          .post("/api/issues/apitest2")
          .send({
            issue_title: "issue",
            issue_text: "text",
            created_by: "chai",
            assigned_to: "assign",
            status_text: "status"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "issue");
            assert.equal(res.body.issue_text, "text");
            assert.equal(res.body.created_by, "chai");
            assert.equal(res.body.assigned_to, "assign");
            assert.equal(res.body.status_text, "status");
            ex1 = res.body._id;
            done();
          });
      });
    test("Missing fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/apitest2")
        .send({
          issue_title: "test_title",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
    });
  });

  //GET Tests
  suite("GET => /api/issues/{project}", function() {
    test("View issues", function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest2")
        .end(function(err, res) {
          const returnedArrays = res.body.filter(issue => issue.project == "apitest2");
          assert.equal(res.status, 200);
          assert.equal(res.body.length, returnedArrays.length);
          done();
        });
    });
    test("View issues with filter", function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest2?status_text=test_status_filter")
        .end(function(err, res) {
          const returnedArrays = res.body.filter(issue => issue.status_text == "test_status_filter");
          assert.equal(res.status, 200);
          assert.equal(res.body.length, returnedArrays.length);
          done();
        });
    });
    test("View issues with multiple filters", function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest2?status_text=test_status_filter&assigned_to=test_assign")
        .end(function(err, res) {
          const returnedArrays = res.body.filter(issue => issue.status_text == "test_status_filter" && issue.assigned_to == "test_assign");
          assert.equal(res.status, 200);
          assert.equal(res.body.length, returnedArrays.length);
          done();
        });
    });
  });  
  //PUT Tests
  suite("PUT => /api/issues/{project}", function() {
    test("Update one issue", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest2")
        .send({
          _id: ex1,
          issue_title: "test_title_updated"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, ex1);
          done();
        });
    });
    test("Update multiple issues", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest2")
        .send({
          _id: ex1,
          issue_title: "test_title_updated2",
          issue_text: "test_text_updated2"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, ex1);
          done();
        });
    });
    test("Missing ID", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest2")
        .send({
          issue_title: "test_title_updated2",
          issue_text: "test_text_updated2"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("No Update Fields", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest2")
        .send({_id: ex2})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });
    test("invalid ID", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest2")
        .send({_id: newId, issue_title: "wont work"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });
  //DELETE Tests
  suite("DELETE => /api/issues/{project}", function() {
    test("Update one issue", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest2")
        .send({
          _id: ex1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          assert.equal(res.body._id, ex1);
          done();
        });
    });
    test("Missing ID", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest2")
        .send({beef: "cake"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("invalid ID", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest2")
        .send({_id: newId})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, undefined);
          done();
        });
    });
  });
});
