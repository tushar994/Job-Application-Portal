const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const JobSchema = new Schema({
  ID: {
    type: Schema.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  recruiterEmail: {
    type: String,
    required: true,
  },
  recruiterName: {
    type: String,
    required: true,
  },
  applicantNumber: {
    type: Number,
    requires: true,
  },
  positionNumber: {
    type: Number,
    requires: true,
  },
  numberapplied: {
    type: Number,
    requires: true,
  },
  postingDate: {
    type: Date,
    required: false,
  },
  applicationLastDate: {
    type: Date,
    required: false,
  },
  requirementList: {
    type: [String],
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Home-time"],
    required: true,
  },
  Duration: {
    type: Number,
    required: true,
  },
  Salary: {
    type: Number,
    required: true,
  },
  Rating: {
    type: {},
    // of: Number,
    required: true,
  },
  applied_SOP: {
    type: {},
    // of: String,
    required: true,
  },
  applied: {
    type: [String],
    required: true,
  },
  rejected: {
    type: [String],
    required: true,
  },
  accepted: {
    type: [String],
    required: true,
  },
  shortlisted: {
    type: [String],
    required: true,
  },
  rating_final: {
    type: Number,
    required: true,
  },
});

module.exports = Job = mongoose.model("jobs", JobSchema);
