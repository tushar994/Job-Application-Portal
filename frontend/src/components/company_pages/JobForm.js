import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class JobForm extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      applicantNumber: "",
      positionNumber: "",
      applicationLastDate: "",
      jobType: "",
      Duration: "",
      Salary: "",
      requirementList: ["java", "python", "mysql"],
      curSkill: "",
      errors: {},
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      title: this.state.title,
      applicantNumber: this.state.applicantNumber,
      positionNumber: this.state.positionNumber,
      applicationLastDate: this.state.applicationLastDate,
      jobType: this.state.jobType,
      Duration: this.state.Duration,
      Salary: this.state.Salary,
      requirementList: this.state.requirementList,
      postingDate: Date.now(),
    };
    // this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    axios
      .post("http://localhost:4000/api/jobs/create_job", jobData)
      .then((res) => {
        alert("Created this Job");
        console.log(res.data);
        this.setState({
          title: "",
          applicantNumber: "",
          positionNumber: "",
          applicationLastDate: "",
          jobType: "",
          Duration: "",
          Salary: "",
          requirementList: ["java", "python", "mysql"],
          curSkill: "",
          errors: {},
        });
      })
      .catch((err) => {
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
        });
      });
  };
  render() {
    const errors = this.state.errors;
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/dashboard" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              dashboard
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Create a job</b> below
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <label htmlFor="email" style={{ margin: 5 }}>
                  Title
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.title}
                  error={errors.title}
                  id="title"
                  type="title"
                  className={classnames("", {
                    invalid: errors.title,
                  })}
                />
                <div className="row col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.title}
                  </span>
                </div>
              </div>

              {/* applicantnumber */}
              <div className="input-field col s12" style={{}}>
                <label htmlFor="applicantNumber" style={{ margin: 5 }}>
                  Maximum number of applicants allowed
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.applicantNumber}
                  error={errors.applicantNumber}
                  id="applicantNumber"
                  type="number"
                  className={classnames("", {
                    invalid: errors.applicantNumber,
                  })}
                />
                <div className="row col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.applicantNumber}
                  </span>
                </div>
              </div>
              {/* positionNumber */}
              <div className="input-field col s12" style={{}}>
                <label htmlFor="positionNumber" style={{ margin: 5 }}>
                  Number of Positions Available
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.positionNumber}
                  error={errors.positionNumber}
                  id="positionNumber"
                  type="number"
                  className={classnames("", {
                    invalid: errors.positionNumber,
                  })}
                />
                <div className="row col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.positionNumber}
                  </span>
                </div>
              </div>
              {/* applicationLastDate */}
              <div className="input-field col s12" style={{}}>
                <label htmlFor="applicationLastDate" style={{ margin: 5 }}>
                  Last date for applying
                </label>
                <input
                  placeholder="mm-dd-yyyy"
                  onChange={this.onChange}
                  value={this.state.applicationLastDate}
                  error={errors.applicationLastDate}
                  id="applicationLastDate"
                  type="date"
                  className={classnames("", {
                    invalid: errors.applicationLastDate,
                  })}
                />
                <div className="row col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.applicationLastDate}
                  </span>
                </div>
              </div>
              {/* jobType */}
              <div className="input-field col s12">
                <label htmlFor="jobType" style={{ margin: 5 }}>
                  Type of job
                </label>
                <select
                  onChange={this.onChange}
                  value={this.state.jobType}
                  error={errors.jobType}
                  id="jobType"
                  // type="password"
                  className={classnames("", {
                    invalid: errors.jobType,
                  })}
                >
                  <option value="" disabled selected>
                    Choose your option
                  </option>
                  <option value="Full-time">Full time</option>
                  <option value="Part-time">Part time</option>
                  <option value="Home-time">Work from home</option>
                </select>
                <div className="col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.jobType}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="input-field col s12" style={{}}>
                <label htmlFor="Duration" style={{ margin: 5 }}>
                  Job duration
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.Duration}
                  error={errors.Duration}
                  id="Duration"
                  type="number"
                  className={classnames("", {
                    invalid: errors.Duration,
                  })}
                />
                <div className="row col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.Duration}
                  </span>
                </div>
              </div>
              {/* Salary */}
              <div className="input-field col s12" style={{}}>
                <label htmlFor="Salary" style={{ margin: 5 }}>
                  Salary per Month
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.Salary}
                  error={errors.Salary}
                  id="Salary"
                  type="number"
                  className={classnames("", {
                    invalid: errors.Salary,
                  })}
                />
                <div className="row col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.Salary}
                  </span>
                </div>
              </div>
              {/* skill list */}
              <div className="input-field col s12" style={{}}>
                <label htmlFor="curSkill" style={{ margin: 5 }}>
                  skills required
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.curSkill}
                  error={errors.curSkill}
                  id="curSkill"
                  type="name"
                  className={classnames("", {
                    invalid: errors.curSkill,
                  })}
                />
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => {
                    if (
                      !this.state.curSkill ||
                      /^\s*$/.test(this.state.curSkill)
                    ) {
                      this.setState({
                        curSkill: "",
                      });
                    } else {
                      var skillz = this.state.requirementList;
                      skillz.push(this.state.curSkill);
                      this.setState({
                        curSkill: "",
                        requirementList: skillz,
                      });
                    }
                  }}
                >
                  Add to skill list
                </Button>
              </div>
              {/* skill list display */}
              <div className="col">
                {this.state.requirementList.map((txt, index) => (
                  <div className="row">
                    <p style={{ color: "blue", margin: 5 }}>{txt}</p>
                    <Button
                      variant="dark"
                      size="sm"
                      onClick={() => {
                        var newset = this.state.requirementList;
                        newset.splice(index, 1);
                        this.setState({
                          requirementList: newset,
                        });
                      }}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <Button
                  variant="primary"
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
JobForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(JobForm);
