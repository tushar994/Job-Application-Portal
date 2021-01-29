const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateJobInput = require("../../validation/job");
const validateJobEdit = require("../../validation/edit_job");
const Validator = require("validator");

// Load User model
const Job = require("../../models/Jobs");
const User = require("../../models/Users");
const isEmpty = require("is-empty");
const Applicant = require("../../models/Applicant");
const Jobs = require("../../models/Jobs");

// @route POST api/selection/reject
// @desc rejects an applicant
// @access Private
router.post(
  "/reject",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Form validation
    // const { errors, isValid } = validateJobInput(req.body);
    // // Check validation
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    // console.log(req.user.role);
    if (req.user.role !== "company") {
      return res.status(400).json({ userError: "not a valid user" });
    }

    Jobs.findOne({ _id: req.body.jobID })
      .then((job) => {
        var isin = "";
        if (job.applied.includes(req.body.applicantEmail)) {
          isin = "applied";
        } else if (job.shortlisted.includes(req.body.applicantEmail)) {
          isin = "shortlisted";
        } else {
          return res.status(400).json({ server_error: "error1" });
        }
        var applied = job[isin] ? job[isin] : [];
        var rejected = job.rejected ? job.rejected : [];
        var index = applied.indexOf(req.body.applicantEmail);
        if (index > -1) {
          applied.splice(index, 1);
        } else {
          return res.status(400).json({ servererror: "error2" });
        }
        rejected.push(req.body.applicantEmail);
        change_obj = {};
        change_obj[isin] = applied;
        change_obj.rejected = rejected;
        Jobs.updateOne({ _id: req.body.jobID }, { $set: change_obj })
          .then((f) => {
            Applicant.findOne({ email: req.body.applicantEmail })
              .then((applicant) => {
                var applied = applicant.applied ? applicant.applied : [];
                var rejected = applicant.rejected ? applicant.rejected : [];
                var index = applied.indexOf(req.body.jobID);
                if (index > -1) {
                  applied.splice(index, 1);
                } else {
                  return res.status(400).json({ servererror: "error3" });
                }
                rejected.push(req.body.jobID);
                Applicant.updateOne(
                  { email: req.body.applicantEmail },
                  { $set: { applied: applied, rejected: rejected } }
                )
                  .then((a) => {
                    return res.status(200).json({ success: "success" });
                  })
                  .catch((e) => {
                    console.log(e);
                    return res.status(400).json({ servererror: "error4" });
                  });
              })
              .catch((e) => {
                console.log(e);
                return res.status(400).json({ servererror: "error5" });
              });
          })
          .catch((e) => {
            console.log(e);
            return res.status(400).json({ servererror: "error6" });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ servererror: "error7" });
      });
  }
);

// @route POST api/selection/promote
// @desc promotes an applicant
// @access Private
router.post(
  "/promote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Form validation
    // const { errors, isValid } = validateJobInput(req.body);
    // // Check validation
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    // console.log(req.user.role);
    if (req.user.role !== "company") {
      return res.status(400).json({ userError: "not a valid user" });
    }

    Jobs.findOne({ _id: req.body.jobID })
      .then((job) => {
        var isin = "";
        var goto = "";
        if (job.applied.includes(req.body.applicantEmail)) {
          isin = "applied";
          goto = "shortlisted";
        } else if (job.shortlisted.includes(req.body.applicantEmail)) {
          isin = "shortlisted";
          goto = "accepted";
        } else {
          return res.status(400).json({ server_error: "error" });
        }

        var isin_arr = job[isin] ? job[isin] : [];
        var goto_arr = job[goto] ? job[goto] : [];
        var index = isin_arr.indexOf(req.body.applicantEmail);
        if (index > -1) {
          isin_arr.splice(index, 1);
        } else {
          return res.status(400).json({ servererror: "error" });
        }
        goto_arr.push(req.body.applicantEmail);
        change_obj = {};
        change_obj[isin] = isin_arr;
        change_obj[goto] = goto_arr;
        Jobs.updateOne({ _id: req.body.jobID }, { $set: change_obj })
          .then((f) => {
            if (goto === "shortlisted") {
              return res.status(200).json({ success: "shortlisted" });
            }
            Applicant.findOne({ email: req.body.applicantEmail }).then(
              (applicant) => {
                var applied = applicant.applied ? applicant.applied : [];
                var accepted = applicant.accepted ? applicant.accepted : [];
                var index = applied.indexOf(req.body.jobID);
                if (index > -1) {
                  applied.splice(index, 1);
                } else {
                  return res.status(400).json({ servererror: "error" });
                }
                accepted.push(req.body.jobID);
                Applicant.updateOne(
                  { email: req.body.applicantEmail },
                  { $set: { applied: applied, accepted: accepted } }
                )
                  .then((a) => {
                    return res.status(200).json({ success: "success" });
                  })
                  .catch((e) => {
                    console.log(e);
                    return res.status(400).json({ servererror: "error" });
                  });
              }
            );
          })
          .catch((e) => {
            console.log(e);
            return res.status(400).json({ servererror: "error" });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ servererror: "error" });
      });
  }
);

module.exports = router;
