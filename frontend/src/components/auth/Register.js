import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import { Button } from "react-bootstrap";
// import { select } from "materialize-css@next";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      role: "",
      errors: {},
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
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
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      role: this.state.role,
    };
    // console.log(newUser);
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col s8 offset-s2">
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Register</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <label htmlFor="name" style={{ margin: 5 }}>
                  Name
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name,
                  })}
                />
                <div className="col">
                  <span className="col" style={{ color: "red" }}>
                    {errors.name}
                  </span>
                </div>
              </div>
              <div className="input-field col s12">
                <label htmlFor="email" style={{ margin: 5 }}>
                  Email
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email,
                  })}
                />
                <div className="col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.email}
                  </span>
                </div>
              </div>
              <div className="input-field col s12">
                <label htmlFor="password" style={{ margin: 5 }}>
                  Password
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password,
                  })}
                />
                <div className="col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.password}
                  </span>
                </div>
              </div>
              <div className="input-field col s12">
                <label htmlFor="password2" style={{ margin: 5 }}>
                  Confirm Password
                </label>
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2,
                  })}
                />
                <div className="col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.password2}
                  </span>
                </div>
              </div>
              {/* role */}
              <div className="input-field col s12">
                <label htmlFor="role" style={{ margin: 5 }}>
                  Role
                </label>
                <select
                  onChange={this.onChange}
                  value={this.state.role}
                  error={errors.role}
                  id="role"
                  // type="password"
                  className={classnames("", {
                    invalid: errors.role,
                  })}
                >
                  <option value="" disabled selected>
                    Choose your option
                  </option>
                  <option value="applicant">I want to apply for jobs</option>
                  <option value="company">I represent a company</option>
                </select>
                <div className="col">
                  <span className="red-text" style={{ color: "red" }}>
                    {errors.role}
                  </span>
                </div>
              </div>
              {/* role */}
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <Button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Sign up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
