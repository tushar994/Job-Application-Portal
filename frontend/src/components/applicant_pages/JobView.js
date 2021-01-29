import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class JobView extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      accepted: [],
      rejected: [],
      applied: [],
      jobs: [],
      loading: true,
      new_rating: "",
      //   accepted_jobs: [],
      //   rejected_jobs: [],
      //   applied_jobs: [],
      errors: {},
    };
  }
  componentWillMount() {
    // initialise values in state from database
    axios
      .get(
        `http://localhost:4000/api/profiles/get_profile/${this.props.auth.user.email}`
      )
      .then((res) => {
        console.log("bruuuuuh");
        console.log(res);
        this.setState({
          accepted: res.data.accepted ? res.data.accepted : [],
          rejected: res.data.rejected ? res.data.rejected : [],
          applied: res.data.applied ? res.data.applied : [],
        });
        console.log("bro");
        axios
          .get(`http://localhost:4000/api/jobs/get_job`)
          .then((res2) => {
            console.log("what");
            console.log(res2.data);
            this.setState({
              jobs: res2.data,
            });
          })
          .then(() => {
            var new_rating = [];
            this.state.accepted.map((val) => {
              new_rating.push("");
            });
            this.setState({
              new_rating: new_rating,
              loading: false,
            });
          });
      });
  }
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  reset() {
    this.setState({
      loading: true,
    });
    axios
      .get(
        `http://localhost:4000/api/profiles/get_profile/${this.props.auth.user.email}`
      )
      .then((res) => {
        console.log("bruuuuuh");
        console.log(res);
        this.setState({
          accepted: res.data.accepted ? res.data.accepted : [],
          rejected: res.data.rejected ? res.data.rejected : [],
          applied: res.data.applied ? res.data.applied : [],
        });
        console.log("bro");
        axios
          .get(`http://localhost:4000/api/jobs/get_job`)
          .then((res2) => {
            console.log("what");
            console.log(res2.data);
            this.setState({
              jobs: res2.data,
            });
          })
          .then(() => {
            var new_rating = [];
            this.state.accepted.map((val) => {
              new_rating.push("");
            });
            this.setState({
              new_rating: new_rating,
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
                Accepted
              </h2>
              <div className="col">
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
                    </tr>
                  </thead>
                  {this.state.accepted.map((res, index) => {
                    const txt = this.state.jobs[res];
                    console.log(txt);
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
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.Salary}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.Duration} Months
                          </td>
                          {/* rate form */}
                          <td style={{ border: "1px solid black" }}>
                            <label htmlFor="Salary" style={{ margin: 5 }}>
                              Rate
                            </label>
                            <select
                              onChange={(e) => {
                                var new_rating = this.state.new_rating;
                                new_rating[index] = e.target.value;
                                this.setState({
                                  new_rating: new_rating,
                                });
                              }}
                              value={this.state.new_rating[index]}
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
                          </td>
                          {/* Rate button */}
                          <td style={{ border: "1px solid black" }}>
                            <Button
                              variant="outline-dark"
                              style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem",
                              }}
                              onClick={() => {
                                console.log(this.state.new_rating[index]);
                                axios
                                  .post(
                                    "http://localhost:4000/api/more_jobs/rate_job",
                                    {
                                      rating: this.state.new_rating[index],
                                      jobID: txt["_id"],
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
                              }}
                              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                            >
                              Rate
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
              {/* applied */}
              <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                Applied
              </h2>
              <div className="col">
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
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.applied.map((res) => {
                      console.log("new stuff");
                      console.log(res);
                      const txt = this.state.jobs[res];
                      console.log("yes");
                      console.log(txt);
                      return (
                        <tr>
                          <td style={{ border: "1px solid black" }}>
                            {txt.title}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.recruiterName}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {Object.keys(txt.Rating).length === 0
                              ? "not rated yet"
                              : txt.rating_final}{" "}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.Salary}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.Duration} Months
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* rejected */}
              <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                Rejected
              </h2>
              <div className="col">
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
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.rejected.map((res) => {
                      console.log("new stuff");
                      console.log(res);
                      const txt = this.state.jobs[res];
                      console.log("yes");
                      console.log(txt);
                      return (
                        <tr>
                          <td style={{ border: "1px solid black" }}>
                            {txt.title}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.recruiterName}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {Object.keys(txt.Rating).length === 0
                              ? "not rated yet"
                              : txt.rating_final}{" "}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.Salary}
                          </td>
                          <td style={{ border: "1px solid black" }}>
                            {txt.Duration} Months
                          </td>
                        </tr>
                      );
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
JobView.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(JobView);
