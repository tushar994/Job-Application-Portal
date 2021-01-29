const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCompanyInput(data) {
  let errors = {};
  const error_messages = {
    contactNumber: "Invalid contact number",
    bio: "Invalid BIO",
  };
  keys = Object.keys(error_messages);
  for (const key of keys) {
    // console.log(key);
    data[key] = !isEmpty(data[key]) ? data[key] : "";
  }

  if (
    data.contactNumber != "" &&
    !Validator.isMobilePhone(data.contactNumber)
  ) {
    errors.contactNumber = "not a valid contact number";
  }

  if (data.bio !== "") {
    if (data.bio.split(" ").length > 150) {
      errors.bio = "too many words";
    }
  }

  if (data.bio === "" && data.contactNumber === "") {
    errors.bio = "both fields were not filled";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
