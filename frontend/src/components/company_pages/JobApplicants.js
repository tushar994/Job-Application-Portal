import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class JobApplicants extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      applicants: [],
      extra: [],
      jobID: "",
      job: {},
      loading: true,
      job_obj: [],
      nameSort: "",
      applyDate: "",
      ratingSort: "",
      display_array: [],
      new_rating: "",
      //   accepted_jobs: [],
      //   rejected_jobs: [],
      //   applied_jobs: [],
      errors: {},
    };
  }
  componentWillMount() {
    // initialise values in state from database
    const { jobID } = this.props.match.params;
    axios
      .post(`http://localhost:4000/api/jobs/get_all_applicants`, {
        jobID: jobID,
      })
      .then((res2) => {
        console.log("what");
        console.log(res2.data);
        var extra = [],
          display_array = [];
        res2.data.map((app) => {
          var rating = 0;
          if (!app.rating) {
            rating = "not rated yet";
          } else if (app.rating.length === 0) {
            rating = "not rated yet";
          } else {
            app.rating.map((rate) => {
              rating = rating + Number(rate);
            });
            rating = rating / app.rating.length;
          }
          extra.push(rating);
          display_array.push(1);
        });
        this.setState({
          email: this.props.auth.user.email,
          name: this.props.auth.user.name,
          applicants: res2.data,
          jobID: jobID,
          extra: extra,
          display_array: display_array,
        });
        console.log("problem??");
        axios
          .post(`http://localhost:4000/api/jobs/get_one_job`, {
            jobID: jobID,
          })
          .then((job) => {
            this.setState({
              job: job.data,
            });
            this.setState({
              loading: false,
            });
          });
      });
  }
  reset() {
    this.setState({
      loading: true,
    });
    axios
      .post(`http://localhost:4000/api/jobs/get_all_applicants`, {
        jobID: this.state.jobID,
      })
      .then((res2) => {
        // console.log("what");
        // console.log(res2);
        var extra = [],
          display_array = [];
        res2.data.map((app) => {
          var rating = 0;
          if (!app.rating) {
            rating = "not rated yet";
          } else if (app.rating.length === 0) {
            rating = "not rated yet";
          } else {
            app.rating.map((rate) => {
              rating = rating + Number(rate);
            });
            rating = rating / app.rating.length;
          }
          extra.push(rating);
          display_array.push(1);
        });
        this.setState({
          email: this.props.auth.user.email,
          name: this.props.auth.user.name,
          applicants: res2.data,
          extra: extra,
          display_array: display_array,
        });
        axios
          .post(`http://localhost:4000/api/jobs/get_one_job`, {
            jobID: this.state.jobID,
          })
          .then((job) => {
            this.setState({
              job: job.data,
            });
            this.setState({
              loading: false,
            });
          });
      });
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  sortIt() {
    var extra = {};
    var extra_arr = [];
    this.state.applicants.map((app) => {
      var rating = 0;
      if (!app.rating) {
        rating = "not rated yet";
      } else if (app.rating.length === 0) {
        rating = 0;
      } else {
        app.rating.map((rate) => {
          rating = rating + Number(rate);
        });
        rating = rating / app.rating.length;
      }
      extra[app.email] = rating;
      extra_arr.push(rating);
    });
    var sorting = this.state.applicants;
    var display_array = this.state.display_array;
    // not ot do date and rating
    // this.state.job.applied_SOP[this.state.applicants[key].email][1]
    sorting.sort((a, b) => {
      // 1 is ascending
      var fa = this.state.job.applied_SOP[a.email][1];
      var fb = this.state.job.applied_SOP[b.email][1];
      if (this.state.applyDate === "-1") {
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
      } else if (this.state.applyDate === "1") {
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
      }
      // now rating
      fa = extra[a.email];
      fb = extra[b.email];
      if (this.state.ratingSort === "-1") {
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
      } else if (this.state.ratingSort === "1") {
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
      }
    });
    extra_arr.sort((a, b) => {
      var fa = a;
      var fb = b;
      if (this.state.ratingSort === "-1") {
        if (fa < fb) {
          return 1;
        }
        if (fa > fb) {
          return -1;
        }
      } else if (this.state.ratingSort === "1") {
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
      }
    });
    if (this.state.nameSort !== "") {
      sorting.map((val, index) => {
        if (
          !val.name.toLowerCase().startsWith(this.state.nameSort.toLowerCase())
        ) {
          display_array[index] = 0;
        } else {
          display_array[index] = 1;
        }
      });
    } else {
      sorting.map((val, index) => {
        display_array[index] = 1;
      });
    }
    this.setState({
      applicants: sorting,
      display_array: display_array,
      extra: extra_arr,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  render() {
    const errors = this.state.errors;
    if (this.state.loading) {
      return <h1>LOADING</h1>;
    }
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/dashboard" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              dashboard
            </Link>
            <form noValidate onSubmit={this.onSubmit}>
              {/* email */}
              <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                Email
              </h2>
              <div className="col">
                <p>{this.state.email}</p>
              </div>
              {/* name */}
              <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                Name
              </h2>
              <div className="col">
                <p>{this.state.name}</p>
              </div>
              {/* accepted */}
              <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                Jobs
              </h2>
              <div className="row col">
                <span className="red-text" style={{ color: "red" }}>
                  {errors.submit_error}
                </span>
              </div>
              <div className="row">
                {/* Name sort */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="curSkill" style={{ margin: 5 }}>
                    Name
                  </label>
                  <input
                    onChange={this.onChange}
                    value={this.state.nameSort}
                    error={errors.nameSort}
                    id="nameSort"
                    type="nameSort"
                    className={classnames("", {
                      invalid: errors.nameSort,
                    })}
                  />
                </div>
                {/* applyDate */}
                <div className="input-field col s12">
                  <label htmlFor="Salary" style={{ margin: 5 }}>
                    applyDate
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.applyDate}
                    error={errors.applyDate}
                    id="applyDate"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.applyDate,
                    })}
                  >
                    <option value="0">None</option>
                    <option value="-1">Descending</option>
                    <option value="1">Ascending</option>
                  </select>
                </div>
                {/* ratingSort */}
                <div className="input-field col s12">
                  <label htmlFor="Duration" style={{ margin: 5 }}>
                    ratingSort
                  </label>
                  <select
                    onChange={this.onChange}
                    value={this.state.ratingSort}
                    error={errors.ratingSort}
                    id="ratingSort"
                    // type="password"
                    className={classnames("", {
                      invalid: errors.ratingSort,
                    })}
                  >
                    <option value="0">None</option>
                    <option value="-1">Descending</option>
                    <option value="1">Ascending</option>
                  </select>
                </div>
                <Button
                  variant="primary"
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  onClick={() => {
                    this.sortIt();
                  }}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Sort
                </Button>
              </div>
              <div className="col">
                <table style={{ border: "1px solid black" }}>
                  <thead>
                    <tr style={{ border: "1px solid black" }}>
                      <th style={{ border: "1px solid black" }}>Email</th>
                      <th style={{ border: "1px solid black" }}>Name</th>
                      <th style={{ border: "1px solid black" }}>Job Rating</th>
                      <th style={{ border: "1px solid black" }}>SOP</th>
                      <th style={{ border: "1px solid black" }}>Skills</th>
                      <th style={{ border: "1px solid black" }}>
                        Date of application
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Stage of application
                      </th>
                      <th style={{ border: "1px solid black" }}>Education</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ====================================The rest of the table ==================================== */}
                    {Object.keys(this.state.applicants).map((key, index) => {
                      // const this.state.jobs[key] = this.state.jobs[res];
                      var disabled, butcolor, buttext, but2color, but2text;
                      if (this.state.applicants[key].status === "applied") {
                        disabled = false;
                        butcolor = "primary";
                        buttext = "shortlist";
                        but2color = "danger";
                        but2text = "Reject";
                      } else if (
                        this.state.applicants[key].status === "shortlisted"
                      ) {
                        disabled = false;
                        butcolor = "warning";
                        buttext = "Accept";
                        but2color = "danger";
                        but2text = "Reject";
                      } else {
                        disabled = true;
                        butcolor = "success";
                        buttext = "Accepted";
                        but2color = "light";
                        but2text = "Rate";
                      }
                      // console.log(this.state.jobs[key]);

                      if (this.state.display_array[index]) {
                        return (
                          <tr>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.applicants[key].email}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.applicants[key].name}
                            </td>
                            {/* rating */}
                            <td style={{ border: "1px solid black" }}>
                              {this.state.extra[index]}
                            </td>

                            <td style={{ border: "1px solid black" }}>
                              {
                                this.state.job.applied_SOP[
                                  this.state.applicants[key].email
                                ][0]
                              }
                            </td>

                            <td style={{ border: "1px solid black" }}>
                              {this.state.applicants[key].skills
                                ? this.state.applicants[
                                    key
                                  ].skills.map((value) => <p>{value}</p>)
                                : "none"}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {
                                this.state.job.applied_SOP[
                                  this.state.applicants[key].email
                                ][1]
                              }
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.applicants[key].status}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.applicants[key].education ? (
                                this.state.applicants[key].education.map(
                                  (value) => (
                                    <p>
                                      {value[0]}:{value[1]}-{value[2]}
                                    </p>
                                  )
                                )
                              ) : (
                                <p>none</p>
                              )}
                            </td>
                            <td>
                              <Button
                                variant={butcolor}
                                disabled={disabled}
                                style={{
                                  width: "150px",
                                  borderRadius: "3px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                }}
                                onClick={() => {
                                  if (!disabled) {
                                    var big_object = {
                                      jobID: this.state.job["_id"],
                                      applicantEmail: this.state.applicants[key]
                                        .email,
                                    };
                                    console.log(big_object);
                                    axios
                                      .post(
                                        "http://localhost:4000/api/selection/promote",
                                        big_object
                                      )
                                      .then((res) => {
                                        console.log("yaaaay");
                                        console.log(res);
                                        this.reset();
                                        alert("promoted him");
                                      })
                                      .catch((err) => {
                                        console.log(err.response.data);
                                        this.setState({
                                          errors: err.response.data,
                                        });
                                      });
                                  }
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                              >
                                {buttext}
                              </Button>
                            </td>
                            {/* reject button */}
                            <td>
                              <Button
                                variant={but2color}
                                style={{
                                  width: "150px",
                                  borderRadius: "3px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                }}
                                onClick={() => {
                                  if (!disabled) {
                                    var big_object = {
                                      applicantEmail: this.state.applicants[key]
                                        .email,
                                      jobID: this.state.jobID,
                                    };
                                    console.log(big_object);
                                    axios
                                      .post(
                                        "http://localhost:4000/api/selection/reject",
                                        big_object
                                      )
                                      .then((res) => {
                                        console.log("yaaaay");
                                        console.log(res);
                                        this.reset();
                                        alert("rejected");
                                      })
                                      .catch((err) => {
                                        console.log(err.response.data);
                                        this.setState({
                                          errors: err.response.data,
                                        });
                                      });
                                  } else {
                                    console.log(this.state.new_rating);
                                    axios
                                      .post(
                                        "http://localhost:4000/api/rate/applicant",
                                        {
                                          rating: this.state.new_rating,
                                          applicantEmail: this.state.applicants[
                                            key
                                          ].email,
                                        }
                                      )
                                      .then((res) => {
                                        console.log("yaaaay");
                                        console.log(res);
                                        this.reset();
                                        alert("rated");
                                      })
                                      .catch((err) => {
                                        console.log(err.response.data);
                                        this.setState({
                                          errors: err.response.data,
                                        });
                                      });
                                  }
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                              >
                                {but2text}
                              </Button>
                            </td>
                            {/* rate form */}
                            <div
                              className="input-field col s12"
                              hidden={!disabled}
                            >
                              <label
                                htmlFor="Salary"
                                style={{ margin: 5 }}
                                hidden={!disabled}
                              >
                                Rate
                              </label>
                              <select
                                hidden={!disabled}
                                onChange={this.onChange}
                                value={this.state.new_rating}
                                error={errors.new_rating}
                                id="new_rating"
                                // type="password"
                                className={classnames("", {
                                  invalid: errors.new_rating,
                                })}
                              >
                                <option value="">None</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </select>
                            </div>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
JobApplicants.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(JobApplicants);
