const mongoose = require("mongoose");
const  Schema = mongoose.Schema;
const issueSchema = new Schema({
  project: String,
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: Date,
  updated_on: Date,
  created_by: { type: String, required: true },
  assigned_to: String,
  open: Boolean,
  status_text: String
});
const issue = mongoose.model("Issue", issueSchema);
exports.issue = issue;