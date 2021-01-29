const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateApplicantInput(data) {
  let errors = {};
  const error_messages = {
    skills: "Invalid input for skills",
    education: "Invalid input for education",
  };

  if (!Array.isArray(data.skills)) {
    errors.skills = "Not valid input for skills";
  }
  if (!Array.isArray(data.education)) {
    errors.education = "Not valid education input";
  } else {
    var fine = 1;
    data.education.forEach((element) => {
      if (!Array.isArray(element)) {
        console.log("yuo");
        fine = 0;
      } else {
        if (element.length > 3 || element.length === 1) {
          console.log("yudd");
          fine = 0;
        } else {
          d = new Date();
          if (Validator.isEmpty(element[0])) {
            console.log("yuss");
            fine = 0;
          }
          if (!Validator.isInt(element[1])) {
            console.log("yu");
            fine = 0;
          } else {
            if (element.length === 2) {
              if (d.getFullYear() - 50 > Number(element[1])) {
                console.log("rt");
                fine = 0;
              }
            } else {
              if (!Validator.isInt(element[2])) {
                console.log("gf");
                fine = 0;
              } else {
                if (d.getFullYear() - 50 > Number(element[1])) {
                  console.log("1");
                  fine = 0;
                }
                if (Number(element[1]) > Number(element[2])) {
                  console.log("2");
                  fine = 0;
                }
                if (Number(element[2]) > d.getFullYear()) {
                  console.log("3");
                  fine = 0;
                }
              }
            }
          }
        }
      }
    });
    if (fine === 0) {
      errors.education = "Not valid input for education";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
