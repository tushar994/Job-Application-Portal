import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class JobShow extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      jobs: [],
      loading: true,
      job_obj: [],
      //   accepted_jobs: [],
      //   rejected_jobs: [],
      //   applied_jobs: [],
      errors: {},
    };
  }
  componentWillMount() {
    // initialise values in state from database

    axios.get(`http://localhost:4000/api/jobs/get_job`).then((res2) => {
      // console.log("what");
      // console.log(res2);
      this.setState({
        email: this.props.auth.user.email,
        name: this.props.auth.user.name,
        jobs: res2.data,
      });
      console.log(this.state.jobs);
      var final_job_obj = [];
      Object.keys(this.state.jobs).map((key, index) => {
        const date = new Date(this.state.jobs[key].applicationLastDate);
        final_job_obj.push([
          date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear(),
          this.state.jobs[key].applicantNumber.toString(),
          this.state.jobs[key].positionNumber.toString(),
          date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear(),
        ]);
      });
      this.setState({
        job_obj: final_job_obj,
        loading: false,
      });
    });
  }
  reset() {
    this.setState({
      loading: true,
    });
    axios.get(`http://localhost:4000/api/jobs/get_job`).then((res2) => {
      // console.log("what");
      // console.log(res2);
      this.setState({
        email: this.props.auth.user.email,
        name: this.props.auth.user.name,
        jobs: res2.data,
      });
      console.log(this.state.jobs);
      var final_job_obj = [];
      Object.keys(this.state.jobs).map((key, index) => {
        const date = new Date(this.state.jobs[key].applicationLastDate);
        final_job_obj.push([
          date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear(),
          this.state.jobs[key].applicantNumber.toString(),
          this.state.jobs[key].positionNumber.toString(),
          date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear(),
        ]);
      });
      this.setState({
        job_obj: final_job_obj,
        loading: false,
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
              <div className="col">
                <table style={{ border: "1px solid black" }}>
                  <thead>
                    <tr style={{ border: "1px solid black" }}>
                      <th style={{ border: "1px solid black" }}>Title</th>
                      <th style={{ border: "1px solid black" }}>Job Rating</th>

                      <th style={{ border: "1px solid black" }}>
                        Max Applicants
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Total number of applicants
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Max Positions
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Number of Hired
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Deadline for Application
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Change Deadline
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Change Max applicants
                      </th>
                      <th style={{ border: "1px solid black" }}>
                        Change max positions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.jobs).map((key, index) => {
                      // const this.state.jobs[key] = this.state.jobs[res];
                      var max_app, max_pos, deadline;
                      console.log(this.state.jobs[key].accepted);
                      if (
                        this.state.jobs[key].accepted.length <
                        Number(this.state.jobs[key].positionNumber)
                      ) {
                        return (
                          <tr>
                            <td style={{ border: "1px solid black" }}>
                              <Link
                                to={
                                  "/see_applicants/" +
                                  this.state.jobs[key]["_id"]
                                }
                                className="btn-flat waves-effect"
                              >
                                <Button variant="outline-primary">
                                  {this.state.jobs[key].title}
                                </Button>
                              </Link>
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {Object.keys(this.state.jobs[key].Rating)
                                .length === 0
                                ? "not rated yet"
                                : this.state.jobs[key].rating_final}
                            </td>

                            <td style={{ border: "1px solid black" }}>
                              {this.state.jobs[key].applicantNumber}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.jobs[key].applied.length +
                                this.state.jobs[key].rejected.length +
                                this.state.jobs[key].accepted.length +
                                this.state.jobs[key].shortlisted.length}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.jobs[key].positionNumber}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.jobs[key].accepted.length}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              {this.state.job_obj[index][3]}
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              <input
                                placeholder="mm-dd-yyyy"
                                onChange={(e) => {
                                  var job_obj_fin = this.state.job_obj;
                                  job_obj_fin[index][0] = e.target.value;
                                  this.setState({
                                    job_obj: job_obj_fin,
                                  });
                                }}
                                value={this.state.job_obj[index][0]}
                                error={errors.curEducation}
                                id={"jobObj" + toString(index) + "0"}
                                type="date"
                                className={classnames("", {
                                  invalid: errors.curEducation,
                                })}
                              />
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              <input
                                placeholder=""
                                onChange={(e) => {
                                  var job_obj_fin = this.state.job_obj;
                                  job_obj_fin[index][1] = e.target.value;
                                  this.setState({
                                    job_obj: job_obj_fin,
                                  });
                                }}
                                value={this.state.job_obj[index][1]}
                                error={errors.curEducation}
                                id={"jobObj" + toString(index) + "1"}
                                type="Number"
                                className={classnames("", {
                                  invalid: errors.curEducation,
                                })}
                              />
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              <input
                                placeholder=""
                                onChange={(e) => {
                                  var job_obj_fin = this.state.job_obj;
                                  job_obj_fin[index][2] = e.target.value;
                                  this.setState({
                                    job_obj: job_obj_fin,
                                  });
                                }}
                                value={this.state.job_obj[index][2]}
                                error={errors.curEducation}
                                id={"jobObj" + toString(index) + "2"}
                                type="Number"
                                className={classnames("", {
                                  invalid: errors.curEducation,
                                })}
                              />
                            </td>
                            <td>
                              <Button
                                variant="primary"
                                style={{
                                  width: "150px",
                                  borderRadius: "3px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                }}
                                onClick={() => {
                                  var big_object = {
                                    applicationLastDate: this.state.job_obj[
                                      index
                                    ][0],
                                    applicantNumber: this.state.job_obj[
                                      index
                                    ][1],
                                    positionNumber: this.state.job_obj[
                                      index
                                    ][2],
                                    jobID: key,
                                  };
                                  console.log(big_object);
                                  axios
                                    .post(
                                      "http://localhost:4000/api/jobs/edit_job",
                                      big_object
                                    )
                                    .then((res) => {
                                      console.log("yaaaay");
                                      console.log(res);
                                      this.reset();
                                      alert("Saved Changes");
                                    })
                                    .catch((err) => {
                                      console.log(err.response.data);
                                      this.setState({
                                        errors: err.response.data,
                                      });
                                    });
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                              >
                                Save changes
                              </Button>
                            </td>
                            {/*============================================================ delete button ============================================================================================================ */}
                            <td>
                              <Button
                                variant="danger"
                                style={{
                                  width: "150px",
                                  borderRadius: "3px",
                                  letterSpacing: "1.5px",
                                  marginTop: "1rem",
                                }}
                                onClick={() => {
                                  var big_object = {
                                    jobID: key,
                                  };
                                  console.log(big_object);
                                  axios
                                    .post(
                                      "http://localhost:4000/api/more_jobs/delete_job",
                                      big_object
                                    )
                                    .then((res) => {
                                      console.log("yaaaay");
                                      console.log(res);
                                      this.reset();
                                      alert("deleted");
                                    })
                                    .catch((err) => {
                                      console.log(err.response.data);
                                      this.setState({
                                        errors: err.response.data,
                                      });
                                    });
                                }}
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                              >
                                Delete Job
                              </Button>
                            </td>
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
JobShow.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(JobShow);
