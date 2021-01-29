import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class SOP_create extends Component {
  constructor() {
    super();
    this.state = {
      SOP: "",
      jobID: "",
      errors: {},
    };
  }
  componentDidMount() {
    // initialise values in state from database
    const { jobID } = this.props.match.params;
    this.setState({
      jobID: jobID,
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
    axios
      .post(`http://localhost:4000/api/jobs/apply_job`, {
        jobID: this.state.jobID,
        applicationSOP: this.state.SOP,
      })
      .then((res) => {
        alert("applied for the job");
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
            <Link to="/view_jobs" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              JobList
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Write your Statement Of Purpose</b> below
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="row">
                {/* skills */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="curSkill" style={{ margin: 5 }}>
                    SOP
                  </label>
                  <textarea
                    rows="2"
                    cols="50"
                    onChange={this.onChange}
                    value={this.state.SOP}
                    error={errors.SOP}
                    id="SOP"
                    type="name"
                    className={classnames("", {
                      invalid: errors.SOP,
                    })}
                  />
                </div>
              </div>
              <div className="row col">
                <span className="red-text" style={{ color: "red" }}>
                  {errors.applyerror}
                </span>
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
                  Apply
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
SOP_create.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(SOP_create);
