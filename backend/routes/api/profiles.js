const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateJobInput = require("../../validation/job");
const validateCompanyInput = require("../../validation/company");
const validateApplicantInput = require("../../validation/applicant");

// Load User model
const Job = require("../../models/Jobs");
const User = require("../../models/Users");
const Company = require("../../models/Company");
const Applicant = require("../../models/Applicant");

// @route POST api/profiles/edit
// @desc edit the profile of a company guy
// @access Private
router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  validation
    if (req.user.role === "applicant") {
      const { errors, isValid } = validateApplicantInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
    }
    if (req.user.role === "company") {
      const { errors, isValid } = validateCompanyInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
    }

    if (req.user.role === "company") {
      var to_change = {};
      to_change.bio = req.body.bio;
      to_change.contactNumber = req.body.contactNumber;
      Company.updateOne({ email: req.user.email }, { $set: to_change })
        .then((user) => {
          return res.status(200).json(to_change);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (req.user.role === "applicant") {
      var to_change = {};
      console.log(req.user.email);
      to_change.skills = req.body.skills;
      to_change.education = req.body.education;
      Applicant.updateOne({ email: req.user.email }, { $set: to_change })
        .then((user) => {
          console.log(user);
          return res.status(200).json(to_change);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
);

// @route GET api/profiles/get_profile
// @desc get the profile data of a guy
// @access Public
router.get("/get_profile/:email", (req, res) => {
  //  validation
  console.log(req.params);
  // if (req.body.role === "applicant") {
  //   Applicant.findOne({ email: req.body.email })
  //     .then((user) => {
  //       return res.status(200).json(user);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  // if (req.body.role === "company") {
  //   console.log(req.body.email);
  //   Company.findOne({ email: req.body.email })
  //     .then((user) => {
  //       return res.status(200).json(user);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  Applicant.findOne({ email: req.params.email })
    .then((user) => {
      if (!!user) {
        console.log(user);
        console.log("what");
        const fin = {
          ...user["_doc"],
          role: "applicant",
        };
        console.log("what");
        return res.status(200).json(fin);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("here");
  Company.findOne({ email: req.params.email })
    .then((user) => {
      if (user) {
        console.log("what");
        const fin = {
          ...user["_doc"],
          role: "company",
        };
        return res.status(200).json(fin);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
