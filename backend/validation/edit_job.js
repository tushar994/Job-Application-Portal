// This contains the function that validates the input given during login, nothing related to the backend, just basic validation like email format and non-empty

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateJobEdit(data) {
  let errors = {};
  const error_messages = {
    applicantNumber: "This field must be filled",
    positionNumber: "This field must be filled",
    applicationLastDate: "This field must be filled",
  };
  keys = Object.keys(error_messages);
  for (const key of keys) {
    // console.log(key);
    data[key] = !isEmpty(data[key]) ? data[key] : "";
  }
  for (const key of keys) {
    if (
      Validator.isEmpty(data["applicantNumber"]) &&
      Validator.isEmpty(data["positionNumber"]) &&
      Validator.isEmpty(data["applicationLastDate"])
    ) {
      errors["submit_error"] = "atleast one of them should be editted";
    }
  }

  if (Number.isFinite(data.applicantNumber)) {
    data.applicantNumber = Number(data.applicantNumber);
  }
  if (Number.isFinite(data.positionNumber)) {
    data.positionNumber = Number(data.positionNumber);
  }
  if (!Validator.isInt(data.applicantNumber)) {
    errors.submit_error = "Not a valid number";
  }
  if (!Validator.isInt(data.positionNumber)) {
    errors.submit_error = "Not a valid number";
  }
  if (
    Validator.isInt(data.positionNumber) &&
    Validator.isInt(data.applicantNumber)
  ) {
    if (Number(data.positionNumber) > Number(data.applicantNumber)) {
      errors.submit_error =
        "You cannot hire more people than are allowed to apply";
    }
  }
  if (!Validator.isAfter(data.applicationLastDate)) {
    errors.submit_error = "Not a valid date";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
