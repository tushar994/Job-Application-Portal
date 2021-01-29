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

// @route POST api/jobs/create_job
// @desc Creates a new job
// @access Private
router.post(
  "/create_job",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Form validation
    const { errors, isValid } = validateJobInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // console.log(req.user.role);
    if (req.user.role !== "company") {
      return res.status(400).json({ userError: "not a valid user" });
    }

    const newJob = new Job({
      title: req.body.title,
      recruiterEmail: req.user.email,
      recruiterName: req.user.name,
      applicantNumber: req.body.applicantNumber,
      positionNumber: req.body.positionNumber,
      postingDate: req.body.postingDate,
      applicationLastDate: req.body.applicationLastDate,
      requirementList: req.body.requirementList,
      jobType: req.body.jobType,
      Duration: req.body.Duration,
      Salary: req.body.Salary,
      Rating: { ignore: 0 },
      applied: [],
      rejected: [],
      accepted: [],
      applied_SOP: { ignore: "ignore" },
      shortlisted: [],
      numberapplied: "0",
      rating_final: "0",
    });
    const recruiterEmail = req.user.email;
    User.findOne({ email: recruiterEmail }).then((user) => {
      if (!user) {
        return res.status(400).json({ emailnotvalid: "Email not valid" });
      }
    });
    newJob
      .save()
      .then((job) => res.json(job))
      .catch((err) => console.log(err));
  }
);

// ======================================================================================================================================================================================
// 2;
// @route POST api/jobs/view_jobs
// @desc lists jobs
// @access Public
router.post("/view_jobs", (req, res) => {
  console.log(req.body);
  var title_obj = {};
  // Salary: this.state.Salary,
  //       Duration: this.state.Duration,
  //       Rating: this.state.Rating,
  //       title: this.state.title,
  //       JobType: this.state.JobType,
  //       Salary_low: this.state.Salary_low,
  //       Salary_high: this.state.Salary_high,
  //       Duration_value: this.state.Duration_value,

  if (req.body.JobType !== "" && req.body.JobType) {
    title_obj.jobType = req.body.JobType;
  }
  if (req.body.Duration_value !== "" && req.body.Duration_value) {
    title_obj.Duration = req.body.Duration_value;
  }
  if (req.body.Salary_low !== "" && req.body.Salary_low) {
    title_obj["Salary"] = { $gte: req.body.Salary_low };
  }
  if (req.body.Salary_high !== "" && req.body.Salary_high) {
    title_obj["Salary"] = { $lte: req.body.Salary_high };
  }
  if (
    req.body.Salary_high !== "" &&
    req.body.Salary_high &&
    req.body.Salary_low !== "" &&
    req.body.Salary_low
  ) {
    title_obj["Salary"] = {
      $lte: req.body.Salary_high,
      $gte: req.body.Salary_low,
    };
  }

  if (req.body.title !== "" && req.body.title) {
    title_obj = { title: req.body.title };
  }
  var sort_obj = {};
  if (req.body.Salary === "1" || req.body.Salary === "-1") {
    sort_obj["Salary"] = Number(req.body.Salary);
  }
  if (req.body.Duration === "1" || req.body.Duration === "-1") {
    sort_obj["Duration"] = Number(req.body.Duration);
  }
  if (req.body.Rating === "1" || req.body.Rating === "-1") {
    sort_obj["Rating"] = Number(req.body.Rating);
  }
  Job.find(title_obj)
    .sort(sort_obj)
    .then((job) => {
      return res.status(200).json(job);
    });
});

//======================================================================================================================================================================================
// 3;
// @route POST api/jobs/apply_job
// @desc applies an applicant for a job, requires jobID and applied_SOP
// @access Private
router.post(
  "/apply_job",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.user.role);
    if (req.user.role !== "applicant") {
      return res.status(400).json({ applyerror: "not a valid user" });
    }
    if (!req.body.applicationSOP) {
      return res
        .status(400)
        .json({ applyerror: "you have to fill something here" });
    }
    if (req.body.applicationSOP === "") {
      return res
        .status(400)
        .json({ applyerror: "you have to fill something here" });
    }
    if (req.body.applicationSOP !== "") {
      if (req.body.applicationSOP.split(" ").length > 150) {
        return res.status(400).json({ applyerror: "too many words" });
      }
    }
    var applied_var = [];
    // check if valid for Applicant and if so then initiliase the arrays
    console.log("applicant");
    Applicant.findOne({ email: req.user.email }).then((user) => {
      if (!user) {
        return res.status(400).json({ applyerror: "not a valid user" });
      } else {
        if (user.applied.length > 10) {
          return res.status(400).json({
            applyerror:
              "You cannot apply for more jobs. You have reached your limit",
          });
        } else if (user.applied.includes(req.body.jobID)) {
          return res
            .status(400)
            .json({ applyerror: "You have already applied for this" });
        } else {
          applied_var = user.applied;
        }
      }
      var job_applied = [];
      var app_SOP = {};
      console.log("Job");
      // check if valid for JOB and if so then initiliase the arrays
      Job.findOne({ _id: req.body.jobID }).then((job) => {
        if (!job) {
          return res.status(400).json({ applyerror: "not a valid job" });
        } else {
          if (
            job.applicantNumber <=
            job.applied.length +
              job.accepted.length +
              job.rejected.length +
              job.shortlisted.length
          ) {
            return res
              .status(400)
              .json({ applyerror: "applicant number limit exceeded. Sorry." });
          } else {
            console.log(job);
            job_applied = job.applied;
            app_SOP = job.applied_SOP;
            console.log("reached unique");
            console.log(app_SOP);
          }
        }
        console.log("done job");
        applied_var.push(req.body.jobID);
        console.log(applied_var);
        job_applied.push(req.user.email);
        console.log(job_applied);
        date = new Date();
        app_SOP[req.user.email] = [
          req.body.applicationSOP,
          date.getFullYear() +
            "-" +
            (date.getMonth() + 1).toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            }) +
            "-" +
            date.getDate().toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            }),
        ];

        console.log("changing");
        console.log(app_SOP);
        Applicant.updateOne(
          { email: req.user.email },
          { $set: { applied: applied_var } }
        ).then((user2) => {
          console.log("changingjob");
          Job.updateOne(
            { _id: req.body.jobID },
            { $set: { applied: job_applied, applied_SOP: app_SOP } }
          ).then((job2) => {
            console.log("chanedjob");
            return res.status(200).json({ applyerror: "done" });
          });
        });
      });
    });
  }
);
// ======================================================================================================================================================================================
// 4;
// @route GET api/jobs/get_job
// @desc give information about all jobs that ave a relation to a certain applicant/comapny
// @access Private
router.get(
  "/get_job/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  validation
    console.log(req.params);
    if (req.user.role === "applicant") {
      Jobs.find({
        $or: [
          { applied: req.user.email },
          { rejected: req.user.email },
          { shortlisted: req.user.email },
          { accepted: req.user.email },
        ],
      }).then((job) => {
        var big_object = {};
        job.map((val) => {
          big_object[val["_id"]] = val;
        });
        if (big_object) {
          return res.status(200).json(big_object);
        } else {
          return res.status(400).json("job doesnt exist");
        }
      });
    } else {
      Jobs.find({ recruiterEmail: req.user.email }).then((job) => {
        var big_object = {};
        job.map((val) => {
          big_object[val["_id"]] = val;
        });
        if (big_object) {
          return res.status(200).json(big_object);
        } else {
          return res.status(400).json("job doesnt exist");
        }
      });
    }
  }
);

// ======================================================================================================================================================================================
// 5;
// @route post api/jobs/edit_job
// @desc edit the max applicants, max positions or the deadline of the application
// @access Private
router.post(
  "/edit_job/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  validation
    const { errors, isValid } = validateJobEdit(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    console.log(req.params);
    if (req.user.role !== "company") {
      return res.status(400).json({ submit_error: "invalid auth" });
    }
    Jobs.findOne({ _id: req.body.jobID })
      .then((job) => {
        if (!job) {
          return res.status(400).json({ submit_error: "no job found" });
        }
        if (req.body.applicantNumber < job.applicantNumber) {
          return res.status(400).json({
            submit_error: "New applicant number can't be less than old one",
          });
        }
        if (req.body.positionNumber < job.positionNumber) {
          return res.status(400).json({
            submit_error: "New position number can't be less than old one",
          });
        }
        if (req.user.email !== job.recruiterEmail) {
          return res.status(400).json({ submit_error: "Not authorised" });
        }
        var big_object = {
          applicantNumber: req.body.applicantNumber,
          positionNumber: req.body.positionNumber,
          applicationLastDate: req.body.applicationLastDate,
        };

        Jobs.updateOne({ _id: req.body.jobID }, big_object)
          .then((job) => {
            return res.status(200).json(job);
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

// ======================================================================================================================================================================================
// 6;
// @route post api/jobs/get_all_applicants
// @desc get all applicants on one job
// @access Private
router.post(
  "/get_all_applicants/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  validation

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
        if (search_obj.length == 0) {
          console.log("what");
          return res.status(200).json(final_array);
        }
        Applicant.find({ $or: search_obj })
          .then((applicants) => {
            console.log("bruuhuh");
            console.log(applicants);
            applicants.map((person) => {
              if (job.applied && job.applied.includes(person.email)) {
                status = "applied";
              } else if (
                job.shortlisted &&
                job.shortlisted.includes(person.email)
              ) {
                status = "shortlisted";
              } else if (job.accepted && job.accepted.includes(person.email)) {
                status = "accepted";
              }
              final_array.push({
                ...person["_doc"],
                status: status,
              });
            });
            console.log(final_array);
            return res.status(200).json(final_array);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ submit_error: "server error" });
      });
  }
);
// ======================================================================================================================================================================================
// 7;
// @route post api/jobs/get_one_job
// @desc get info on one job
// @access Private
router.post(
  "/get_one_job/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //  validation

    console.log(req.params);
    if (req.user.role !== "company") {
      return res.status(400).json({ submit_error: "invalid auth" });
    }
    Jobs.findOne({ _id: req.body.jobID })
      .then((job) => {
        if (!job) {
          return res.status(400).json({ submit_error: "no job found" });
        }
        return res.status(200).json(job);
      })
      .catch((e) => {
        console.log(e);
        return res.status(400).json({ submit_error: "server error" });
      });
  }
);

module.exports = router;
