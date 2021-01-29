const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const Validator = require("validator");
const isEmpty = require("is-empty");

// Load input validation
const validateJobInput = require("../../validation/job");
const validateCompanyInput = require("../../validation/company");
const validateApplicantInput = require("../../validation/applicant");

// Load User model
const Job = require("../../models/Jobs");
const User = require("../../models/Users");
const Company = require("../../models/Company");
const Applicant = require("../../models/Applicant");

// @route POST api/rate/applicant
// @desc rate an applicant
// @access Private
router.post(
  "/applicant",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  validation
    if (req.user.role !== "company") {
      return res.status(400).json({ submit_error: "Invalid auth" });
    }
    console.log(req.body.rating);
    req.body.rating = !isEmpty(req.body.rating) ? req.body.rating : "";
    console.log(req.body.rating);
    if (Validator.isEmpty(req.body.rating)) {
      return res.status(400).json({ submit_error: "Invalid rating" });
    }
    if (Number.isFinite(req.body.rating)) {
      req.body.rating = Number(req.body.rating);
    }
    if (!Validator.isInt(req.body.rating)) {
      return res.status(400).json({ submit_error: "Invalid rating2" });
    }
    if (req.body.rating > 5 || req.body.rating < 0) {
      return res.status(400).json({ submit_error: "Invalid rating3" });
    }
    Applicant.findOne({ email: req.body.applicantEmail })
      .then((app) => {
        var rating = app.rating;
        rating.push(req.body.rating);
        Applicant.updateOne(
          { email: req.body.applicantEmail },
          { $set: { rating: rating } }
        )
          .then((f) => {
            return res.status(200).json({ success: "success" });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({ submit_error: "server error" });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ rate_error: "server error" });
      });
  }
);

module.exports = router;
