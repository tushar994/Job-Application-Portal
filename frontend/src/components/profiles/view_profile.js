import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class ProfileView extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      name: "",
      skills: [],
      education: [],
      contactNumber: "",
      bio: "",
      role: "",
      errors: {},
    };
  }
  componentDidMount() {
    // initialise values in state from database
    const { email } = this.props.match.params;
    console.log(email);
    axios
      .get(`http://localhost:4000/api/profiles/get_profile/${email}`)
      .then((res) => {
        console.log(res);
        this.setState({
          email: res.data.email,
          name: res.data.name,
        });
        if (res.data.role === "company") {
          console.log("company");
          this.setState({
            contactNumber: res.data.contactNumber,
            bio: res.data.bio,
            role: "company",
          });
        } else if (res.data.role === "applicant") {
          console.log("yess");
          this.setState({
            skills: res.data.skills,
            education: res.data.education,
            role: "applicant",
          });
        }
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
    if (this.state.role === "applicant") {
      return (
        <div className="container">
          <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
              <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back
                to dashboard
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
                {/* skill list display */}
                <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                  skills list
                </h2>
                <div className="col">
                  {this.state.skills.map((txt, index) => (
                    <div className="row">
                      <p style={{ color: "blue", margin: 5 }}>{txt}</p>
                    </div>
                  ))}
                </div>

                {/* education list display */}
                <h2 htmlFor="curSkill" style={{ margin: 5 }}>
                  education
                </h2>
                <div className="col">
                  {this.state.education.map((txt, index) => (
                    <div className="row">
                      <p style={{ color: "blue", margin: 5 }}>{txt[0]}</p>
                      <p style={{ color: "blue", margin: 5 }}>{txt[1]}</p>
                      <p style={{ color: "blue", margin: 5 }}>
                        {txt[2] ? txt[2] : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
              <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back
                to dashboard
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
                {/* contactNumber */}
                <div className="input-field col s12" style={{}}>
                  <h2 htmlFor="contactNumber" style={{ margin: 5 }}>
                    Contact Number
                  </h2>
                  <p>{this.state.contactNumber}</p>
                </div>
                {/* bio */}
                <div className="input-field col s12" style={{}}>
                  <div className="col">
                    <h2 htmlFor="bio" style={{ margin: 5 }}>
                      Bio
                    </h2>
                  </div>
                  <p>{this.state.bio}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}
ProfileView.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(ProfileView);
