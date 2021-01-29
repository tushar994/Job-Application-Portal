// This contains the function that validates the input given during login, nothing related to the backend, just basic validation like email format and non-empty

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobInput(data) {
  let errors = {};
  const error_messages = {
    title: "The job must have a title",
    applicantNumber: "This field must be filled",
    positionNumber: "This field must be filled",
    applicationLastDate: "This field must be filled",
    jobType: "This must be filled",
    Duration: "This must be filled",
    Salary: "This must be filled",
  };
  keys = Object.keys(error_messages);
  for (const key of keys) {
    // console.log(key);
    data[key] = !isEmpty(data[key]) ? data[key] : "";
  }
  for (const key of keys) {
    if (Validator.isEmpty(data[key])) {
      errors[key] = error_messages[key];
    }
  }
  if (
    !(
      Validator.equals(data["jobType"], "Full-time") ||
      Validator.equals(data["jobType"], "Part-time") ||
      Validator.equals(data["jobType"], "Home-time")
    )
  ) {
    errors.jobType = "Not a valid option";
  }
  if (Number.isFinite(data.applicantNumber)) {
    data.applicantNumber = Number.toString(data.applicantNumber);
  }
  if (Number.isFinite(data.positionNumber)) {
    data.positionNumber = Number.toString(data.positionNumber);
  }
  if (!Validator.isInt(data.applicantNumber)) {
    errors.applicantNumber = "Not a valid number";
  }
  if (!Validator.isInt(data.positionNumber)) {
    errors.positionNumber = "Not a valid number";
  }
  if (
    Validator.isInt(data.positionNumber) &&
    Validator.isInt(data.applicantNumber)
  ) {
    if (Number(data.positionNumber) > Number(data.applicantNumber)) {
      errors.positionNumber =
        "You cannot hire more people than are allowed to apply";
    }
  }
  if (!Validator.isInt(data.Salary)) {
    errors.Salary = "Not a valid number";
  }
  if (!Validator.isInt(data.Duration, { min: 0, max: 6 })) {
    errors.Duration = "Not a valid number";
  }
  if (!Validator.isAfter(data.applicationLastDate)) {
    errors.applicationLastDate = "Not a valid date";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
