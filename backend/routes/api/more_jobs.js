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
const Jobs = require("../../models/Jobs");
const User = require("../../models/Users");
const Company = require("../../models/Company");
const Applicant = require("../../models/Applicant");

// @route POST api/more_jobs/delete_job
// @desc edit the profile of a company guy
// @access Private
router.post(
  "/delete_job",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params);
    if (req.user.role !== "company") {
      return res.status(400).json({ submit_error: "invalid auth" });
    }
    Jobs.findOne({ _id: req.body.jobID })
      .then((job) => {
        if (!job) {
          return res.status(400).json({ submit_error: "no job found" });
        }

        if (req.user.email !== job.recruiterEmail) {
          return res.status(400).json({ submit_error: "Not authorised" });
        }

        var search_obj = [];
        var final_array = [];
        var status = "applied";
        // applied first
        job.applied.map((email) => {
          search_obj.push({ email: email });
        });
        job.accepted.map((email) => {
          search_obj.push({ email: email });
        });
        job.shortlisted.map((email) => {
          search_obj.push({ email: email });
        });
        job.rejected.map((email) => {
          search_obj.push({ email: email });
        });
        Jobs.remove({ _id: req.body.jobID })
          .then((final) => {
            if (search_obj.length == 0) {
              console.log("what");
              return res.status(200).json(final_array);
            }
            Applicant.updateMany(
              { $or: search_obj },
              {
                $pull: {
                  applied: req.body.jobID,
                  accepted: req.body.jobID,
                  rejected: req.body.jobID,
                },
              }
            )
              .then((applicants) => {
                return res.status(200).json({ success: "success" });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json({ submit_error: "server error" });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({ submit_error: "server error" });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ submit_error: "server error" });
      });
  }
);
//2
// @route POST api/more_jobs/rate_job
// @desc edit the profile of a company guy
// @access Private
router.post(
  "/rate_job",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params);
    if (req.user.role !== "applicant") {
      return res.status(400).json({ submit_error: "invalid auth" });
    }
    Jobs.findOne({ _id: req.body.jobID })
      .then((job) => {
        if (!job) {
          return res.status(400).json({ submit_error: "no job found" });
        }
        if (!job.accepted) {
          return res.status(400).json({ submit_error: "no job found" });
        }

        if (!job.accepted.includes(req.user.email)) {
          return res.status(400).json({ submit_error: "Not authorised" });
        }

        var rating = job.Rating;
        var final_rating = 0;
        console.log(final_rating);
        var count = 0;
        Object.keys(job.Rating).map((key, index) => {
          if (key !== "ignore" && key !== req.user.email) {
            console.log("what what ");
            final_rating = final_rating + job.Rating[key];
            count = count + 1;
          }
        });
        rating[req.user.email] = req.body.rating;
        final_rating += req.body.rating;
        count = count + 1;
        final_rating = final_rating / count;
        console.log(final_rating);
        Jobs.updateOne(
          { _id: req.body.jobID },
          { $set: { Rating: rating, rating_final: final_rating } }
        )
          .then((f) => {
            return res.status(200).json({ success: "success" });
          })
          .catch((e) => {
            console.log(e);
            return res.status(400).json({ submit_error: "server error" });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ submit_error: "server error" });
      });
  }
);

//3
// @route POST api/more_jobs/get_employees
// @desc get the employees of a company guy
// @access Private
router.post(
  "/get_employees",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params);
    if (req.user.role !== "company") {
      return res.status(400).json({ submit_error: "invalid auth" });
    }
    Jobs.find({ recruiterEmail: req.user.email })
      .then((job) => {
        if (!job) {
          return res.status(400).json({ submit_error: "no job found" });
        }
        console.log(job);
        or_arr = [];
        final_arr = [];
        job.map((val) => {
          if (val.accepted && val.accepted.length > 0) {
            val.accepted.map((str) => {
              or_arr.push({ email: str });
              final_arr.push({
                jobTitle: val.title,
                employeeEmail: str,
                jobType: val.jobType,
              });
            });
          }
        });
        res.status(200).json(final_arr);
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ submit_error: "server error" });
      });
  }
);

//4
// @route POST api/more_jobs/get_applicants
// @desc get the applicants of a company guy
// @access Private
router.post(
  "/get_applicants",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params);
    if (req.user.role !== "company") {
      return res.status(400).json({ submit_error: "invalid auth" });
    }
    Jobs.find({ recruiterEmail: req.user.email })
      .then((job) => {
        if (!job) {
          return res.status(400).json({ submit_error: "no job found" });
        }
        console.log(job);
        or_arr = [];
        final_arr = [];
        job.map((val) => {
          if (val.accepted && val.accepted.length > 0) {
            val.accepted.map((str) => {
              or_arr.push({ email: str });
              final_arr.push({
                jobID: val["_id"],
                jobTitle: val.title,
                employeeEmail: str,
                jobType: val.jobType,
                applied_SOP: val.applied_SOP,
              });
            });
          }
        });
        Applicant.find({ $or: or_arr })
          .then((applicants) => {
            if (!applicants) {
              return res.status(400).json({ submit_error: "server error" });
            }
            applicants.map((applicant) => {
              final_arr.map((val, index) => {
                if (val.employeeEmail === applicant.email) {
                  var status = "";
                  if (applicant.accepted.includes(val.jobID)) {
                    final_arr[index] = {
                      ...val,
                      ...applicant["_doc"],
                      status: "accepted",
                    };
                  }
                }
              });
            });
            res.status(200).json(final_arr);
          })
          .catch((e) => {
            console.log(e);
            return res.status(400).json({ submit_error: "server error" });
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ submit_error: "server error" });
      });
  }
);

module.exports = router;
