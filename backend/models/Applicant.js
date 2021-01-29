const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApplicantSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  rating: {
    type: [Number],
    required: false,
  },
  skills: {
    type: [String],
    required: true,
  },
  education: {
    type: Array,
    required: true,
  },
  applied: {
    type: [String],
    required: false,
  },
  accepted: {
    type: [String],
    required: false,
  },
  rejected: {
    type: [String],
    required: false,
  },
});

module.exports = Applicant = mongoose.model("applicants", ApplicantSchema);
