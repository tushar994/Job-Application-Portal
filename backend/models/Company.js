const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CompanySchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  contactNumber: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
});

module.exports = Company = mongoose.model("companys", CompanySchema);
