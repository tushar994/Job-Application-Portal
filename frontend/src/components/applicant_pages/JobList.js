import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class JobList extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      Salary: "0",
      Duration: "0",
      Rating: "0",
      JobType: "",
      Salary_low: "",
      Salary_high: "",
      Duration_value: "",
      Jobs: [],
      SOP: "",
      applied: [],
      rejected: [],
      accepted: [],
      errors: {},
      date_extra: [],
      loading: true,
    };
  }
  componentWillMount() {
    // initialise values in state from database
    axios
      .post(`http://localhost:4000/api/jobs/view_jobs`, {
        Salary: this.state.Salary,
        Duration: this.state.Duration,
        Rating: this.state.Rating,
        title: this.state.title,
        JobType: this.state.JobType,
        Salary_low: this.state.Salary_low,
        Salary_high: this.state.Salary_high,
        Duration_value: this.state.Duration_value,
      })
      .then((res) => {
        // console.log(res.data);
        var date_extra = [];
        res.data.map((val, index) => {
          const date = new Date(val.applicationLastDate);
          date_extra.push(
            date.getMonth() +
              1 +
              "-" +
              date.getDate() +
              "-" +
              date.getFullYear()
          );
        });
        this.setState({
          Jobs: res.data,
          date_extra: date_extra,
        });
        axios
          .get(
            `http://localhost:4000/api/profiles/get_profile/${this.props.auth.user.email}`
          )
          .then((res2) => {
            this.setState({
              applied: res2.data.applied,
              rejected: res2.data.rejected,
              accepted: res2.data.accepted,
              loading: false,
            });
          });
      });
  }
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
    this.setState({
      loading: true,
    });
    axios
      .post(`http://localhost:4000/api/jobs/view_jobs`, {
        Salary: this.state.Salary,
        Duration: this.state.Duration,
        Rating: this.state.Rating,
        title: this.state.title,
        JobType: this.state.JobType,
        Salary_low: this.state.Salary_low,
        Salary_high: this.state.Salary_high,
        Duration_value: this.state.Duration_value,
      })
      .then((res) => {
        var date_extra = [];
        res.data.map((val, index) => {
          const date = new Date(val.applicationLastDate);
          date_extra.push(
            date.getMonth() +
              1 +
              "-" +
              date.getDate() +
              "-" +
              date.getFullYear()
          );
        });
        console.log(res.data);
        this.setState({
          Jobs: res.data,
          date_extra: date_extra,
          loading: false,
        });
      });
  };
  render() {
    const errors = this.state.errors;
    if (this.state.loading) {
      return <h1>Loading</h1>;
    }
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
                <b>Search For Jobs</b> below
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="row">
                {/* skills */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="curSkill" style={{ margin: 5 }}>
                    title
                  </label>
                  <input
                    onChange={this.onChange}
                    value={this.state.title}
                    error={errors.title}
                    id="title"
                    type="name"
                    className={classnames("", {
                      invalid: errors.title,
                    })}
                  />
                </div>
                {/* Salary */}
                <div className="input-field col s12">
                  <label htmlFor="Salary" style={{ margin: 5 }}>
                    Salary
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.Salary}
                    error={errors.Salary}
                    id="Salary"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.Salary,
                    })}
                  >
                    <option value="0">None</option>
                    <option value="-1">Descending</option>
                    <option value="1">Ascending</option>
                  </select>
                </div>
                {/* Duration */}
                <div className="input-field col s12">
                  <label htmlFor="Duration" style={{ margin: 5 }}>
                    Duration
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.Duration}
                    error={errors.Duration}
                    id="Duration"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.Duration,
                    })}
                  >
                    <option value="0">None</option>
                    <option value="-1">Descending</option>
                    <option value="1">Ascending</option>
                  </select>
                </div>
                {/* Rating */}
                <div className="input-field col s12">
                  <label htmlFor="Rating" style={{ margin: 5 }}>
                    Rating
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.Rating}
                    error={errors.Rating}
                    id="Rating"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.Rating,
                    })}
                  >
                    <option value="0">None</option>
                    <option value="-1">Descending</option>
                    <option value="1">Ascending</option>
                  </select>
                </div>
              </div>
              <div className="row">
                {/* JobType */}
                <div className="input-field col s12">
                  <label htmlFor="JobType" style={{ margin: 5 }}>
                    JobType
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.JobType}
                    error={errors.JobType}
                    id="JobType"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.JobType,
                    })}
                  >
                    <option value="">None</option>
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Home-time">Work From Home</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="curSkill" style={{ margin: 5 }}>
                    Salary Range
                  </label>
                  <div className="input-field col s12">
                    <input
                      onChange={this.onChange}
                      value={this.state.Salary_low}
                      error={errors.Salary_low}
                      id="Salary_low"
                      type="number"
                      className={classnames("", {
                        invalid: errors.Salary_low,
                      })}
                    />

                    <input
                      onChange={this.onChange}
                      value={this.state.Salary_high}
                      error={errors.Salary_high}
                      id="Salary_high"
                      type="number"
                      className={classnames("", {
                        invalid: errors.Salary_high,
                      })}
                    />
                  </div>
                </div>
                {/* Duration */}
                <div className="input-field col s12">
                  <label htmlFor="Duration_value" style={{ margin: 5 }}>
                    Duration
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.Duration_value}
                    error={errors.Duration_value}
                    id="Duration_value"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.Duration_value,
                    })}
                  >
                    <option value="">None</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>

                {/* search button */}
                <Button
                  style={{
                    width: "100px",
                    height: " 50px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Search
                </Button>
              </div>
              {/* jobs list display */}
              <label htmlFor="curSkill" style={{ margin: 5 }}>
                Job list
              </label>
              <table style={{ border: "1px solid black" }}>
                <thead>
                  <tr style={{ border: "1px solid black" }}>
                    <th style={{ border: "1px solid black" }}>Title</th>
                    <th style={{ border: "1px solid black" }}>
                      Recruiter Name
                    </th>
                    <th style={{ border: "1px solid black" }}>Job Rating</th>
                    <th style={{ border: "1px solid black" }}>Salary</th>
                    <th style={{ border: "1px solid black" }}>Duration</th>
                    <th style={{ border: "1px solid black" }}>
                      Deadline of Application
                    </th>
                    <th style={{ border: "1px solid black" }}>Type</th>
                  </tr>
                </thead>
                {this.state.Jobs.map((txt, index) => {
                  // if (
                  //   !(
                  //     txt.applied.length +
                  //       txt.rejected.length +
                  //       txt.accepted.length +
                  //       txt.shortlisted.length >=
                  //     txt.applicantNumber
                  //   ) &&
                  //   !(txt.accepted.length >= txt.positionNumber)
                  // ) {
                  console.log("unique");
                  console.log(txt.Rating);
                  return (
                    <tbody>
                      <tr>
                        <td style={{ border: "1px solid black" }}>
                          {txt.title}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {txt.recruiterName}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {Object.keys(txt.Rating).length === 1
                            ? "not rated yet"
                            : txt.rating_final}
                          {/* {typeof txt.Rating} */}
                          {/* {typeof txt.applied_SOP} */}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {txt.Salary}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {txt.Duration} Months
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {this.state.date_extra[index]}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {txt.jobType}
                        </td>
                        {this.state.applied.includes(txt["_id"]) ||
                        this.state.rejected.includes(txt["_id"]) ||
                        this.state.accepted.includes(txt["_id"]) ? (
                          <Button
                            variant="danger"
                            style={{
                              width: "150px",
                              borderRadius: "3px",
                              letterSpacing: "1.5px",
                              marginTop: "1rem",
                            }}
                            type="submit"
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                          >
                            Applied
                          </Button>
                        ) : txt.applied.length +
                            txt.rejected.length +
                            txt.shortlisted.length +
                            txt.accepted.length >=
                            txt.applicantNumber ||
                          txt.accepted.length >= txt.positionNumber ? (
                          <Button
                            variant="warning"
                            style={{
                              width: "150px",
                              borderRadius: "3px",
                              letterSpacing: "1.5px",
                              marginTop: "1rem",
                            }}
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                          >
                            Full
                          </Button>
                        ) : (
                          <Link
                            to={`/SOP_create/${txt["_id"]}`}
                            className="btn-flat waves-effect"
                          >
                            Apply
                          </Link>
                        )}
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
JobList.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(JobList);
