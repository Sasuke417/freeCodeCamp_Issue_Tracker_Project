"use strict";
const mongoose = require("mongoose");
const issueModel = require("../models").issue;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let filters = req.query;
      filters["project"] = req.params.project;
      issueModel.find(filters, (err, docs) => {
        if (err) return console.error(err);
        res.json(docs);
      });
    })

    .post(function (req, res) {
      const input = req.body;
      if (!input.issue_text || !input.issue_title || !input.created_by) {
        return res.json({ error: "required field(s) missing" });
      }
      const newIssue = new issueModel({
        project: req.params.project,
        issue_title: input.issue_title || "",
        issue_text: input.issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: input.created_by || "",
        assigned_to: input.assigned_to || "",
        open: true,
        status_text: input.status_text || "",
      });
      newIssue.save((err, data) => {
        if (err) console.error(err);
        res.json(newIssue);
      });
    })

    .put(function (req, res) {
      const input = req.body;
      if (!("_id" in input)) res.json({ error: "missing _id" });
      else if (Object.keys(input).length < 2)
        res.json({ error: "no update field(s) sent", _id: input._id });
      else {
        issueModel.findById({ _id: input._id }, (err, doc) => {
          if (err) return console.error(err);
          else if (!doc)
            res.json({ error: "could not update", _id: input._id });
          else {
            (doc.issue_title =
              "issue_title" in input ? input.issue_title : doc.issue_title),
              (doc.issue_text =
                "issue_text" in input ? input.issue_text : doc.issue_text),
              //doc.created_on= new Date(),
              //doc.updated_on= new Date(),
              (doc.created_by =
                "created_by" in input ? input.created_by : doc.created_by),
              (doc.assigned_to =
                "assigned_to" in input ? input.assigned_to : doc.assigned_to),
              (doc.open = "open" in input ? input.open : doc.open),
              (doc.status_text =
                "status_text" in input ? input.status_text : doc.status_text);
            let tempDate = new Date();
            tempDate.setSeconds(tempDate.getSeconds() + 1);
            doc.updated_on = tempDate;
            doc.save((err, data) => {
              if (err) {
                res.json({ error: "could not update", _id: input._id });
                return console.error(err);
              }
              res.json({ result: "successfully updated", _id: input._id });
            });
          }
        });
      }
    })

    .delete(function (req, res) {
      let input = req.body;
      if (!("_id" in input)) res.json({ error: "missing _id" });
      else if (Object.keys(input).length > 1)
        res.json({ error: "could not delete", _id: input._id });
      else {
        issueModel.findByIdAndRemove(input._id, (err, data) => {
          if (err) res.json({ error: "could not delete", _id: input._id });
          res.json({ result: "successfully deleted", _id: input._id });
        });
      }
    });
};
