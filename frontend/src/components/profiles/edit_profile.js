import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
class ProfileForm extends Component {
  constructor() {
    super();
    this.state = {
      skills: [],
      education: [],
      contactNumber: "",
      bio: "",
      curSkill: "",
      curEducation: ["", "", ""],
      errors: {},
      loading: true,
    };
  }
  componentDidMount() {
    // initialise values in state from database
    axios
      .get(
        `http://localhost:4000/api/profiles/get_profile/${this.props.auth.user.email}`
      )
      .then((res) => {
        if (this.props.auth.user.role === "company") {
          this.setState({
            contactNumber: res.data.contactNumber,
            bio: res.data.bio,
          });
        } else {
          this.setState({
            skills: res.data.skills,
            education: res.data.education,
          });
        }
        this.setState({
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
  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    e.preventDefault();
    if (this.props.auth.user.role === "company") {
      const profileData = {
        contactNumber: this.state.contactNumber,
        bio: this.state.bio,
      };
      axios
        .post("http://localhost:4000/api/profiles/edit", profileData)
        .then((res) => {
          alert("Saved");
          console.log(res.data);
          this.setState({
            errors: {},
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          this.setState({
            errors: err.response.data,
          });
        });
    } else {
      const profileData = {
        skills: this.state.skills,
        education: this.state.education,
      };
      axios
        .post("http://localhost:4000/api/profiles/edit", profileData)
        .then((res) => {
          alert("Saved");
          console.log(res.data);
          this.setState({
            errors: {},
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          this.setState({
            errors: err.response.data,
          });
        });
    }
  };
  render() {
    const errors = this.state.errors;
    if (this.state.loading) {
      return <h2>LOADING</h2>;
    }
    if (this.props.auth.user.role === "applicant") {
      return (
        <div className="container">
          <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
              <Link to="/dashboard" className="btn-flat waves-effect">
                <i className="material-icons left">keyboard_backspace</i> Back
                to dashboard
              </Link>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                  <b>Edit Your Profile</b> below
                </h4>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                {/* skills */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="curSkill" style={{ margin: 5 }}>
                    skills
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
                        var skillz = this.state.skills;
                        skillz.push(this.state.curSkill);
                        this.setState({
                          curSkill: "",
                          skills: skillz,
                        });
                      }
                    }}
                  >
                    Add to skill list
                  </Button>
                </div>
                {/* skill list display */}
                <label htmlFor="curSkill" style={{ margin: 5 }}>
                  skills list
                </label>
                <div className="col">
                  {this.state.skills.map((txt, index) => (
                    <div className="row">
                      <p style={{ color: "blue", margin: 5 }}>{txt}</p>
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => {
                          var newset = this.state.skills;
                          newset.splice(index, 1);
                          this.setState({
                            skills: newset,
                          });
                        }}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
                {/* education */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="curEducation" style={{ margin: 5 }}>
                    add education
                  </label>
                  <input
                    placeholder="institution"
                    onChange={(e) => {
                      this.setState({
                        curEducation: [
                          e.target.value,
                          this.state.curEducation[1],
                          this.state.curEducation[2],
                        ],
                      });
                    }}
                    value={this.state.curEducation[0]}
                    error={errors.curEducation}
                    id="curEducation"
                    type="name"
                    className={classnames("", {
                      invalid: errors.curEducation,
                    })}
                  />
                  <input
                    placeholder="start year"
                    onChange={(e) => {
                      this.setState({
                        curEducation: [
                          this.state.curEducation[0],
                          e.target.value,
                          this.state.curEducation[2],
                        ],
                      });
                    }}
                    value={this.state.curEducation[1]}
                    error={errors.curEducation}
                    id="curEducation1"
                    type="name"
                    className={classnames("", {
                      invalid: errors.curEducation,
                    })}
                  />
                  <input
                    placeholder="end year"
                    onChange={(e) => {
                      this.setState({
                        curEducation: [
                          this.state.curEducation[0],
                          this.state.curEducation[1],
                          e.target.value,
                        ],
                      });
                    }}
                    value={this.state.curEducation[2]}
                    error={errors.curEducation}
                    id="curEducation2"
                    type="name"
                    className={classnames("", {
                      invalid: errors.curEducation,
                    })}
                  />
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => {
                      if (
                        !this.state.curEducation[0] ||
                        /^\s*$/.test(this.state.curEducation[0])
                      ) {
                        this.setState({
                          curEducation: ["", "", ""],
                        });
                      } else if (
                        !this.state.curEducation[1] ||
                        /^\s*$/.test(this.state.curEducation[1])
                      ) {
                        this.setState({
                          curEducation: ["", "", ""],
                        });
                      } else {
                        var skillz = this.state.education;
                        skillz.push(this.state.curEducation);
                        this.setState({
                          curEducation: ["", "", ""],
                          education: skillz,
                        });
                      }
                    }}
                  >
                    Add to skill list
                  </Button>
                  <div className="row col">
                    <span className="red-text" style={{ color: "red" }}>
                      {errors.education}
                    </span>
                  </div>
                </div>
                {/* education list display */}
                <label htmlFor="curSkill" style={{ margin: 5 }}>
                  education
                </label>
                <div className="col">
                  {this.state.education.map((txt, index) => (
                    <div className="row">
                      <p style={{ color: "blue", margin: 5 }}>{txt[0]}</p>
                      <p style={{ color: "blue", margin: 5 }}>{txt[1]}</p>
                      <p style={{ color: "blue", margin: 5 }}>
                        {txt[2] ? txt[2] : ""}
                      </p>
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => {
                          var newset = this.state.education;
                          newset.splice(index, 1);
                          this.setState({
                            education: newset,
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
                    Save Changes
                  </Button>
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
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <h4>
                  <b>Edit Your Profile</b> below
                </h4>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                {/* contactNumber */}
                <div className="input-field col s12" style={{}}>
                  <label htmlFor="contactNumber" style={{ margin: 5 }}>
                    Contact Number
                  </label>
                  <input
                    onChange={this.onChange}
                    value={this.state.contactNumber}
                    error={errors.contactNumber}
                    id="contactNumber"
                    type="name"
                    className={classnames("", {
                      invalid: errors.contactNumber,
                    })}
                  />
                  <div className="row col">
                    <span className="red-text" style={{ color: "red" }}>
                      {errors.contactNumber}
                    </span>
                  </div>
                </div>
                {/* bio */}
                <div className="input-field col s12" style={{}}>
                  <div className="col">
                    <label htmlFor="bio" style={{ margin: 5 }}>
                      Bio
                    </label>
                  </div>
                  <textarea
                    rows="2"
                    cols="50"
                    onChange={this.onChange}
                    value={this.state.bio}
                    error={errors.bio}
                    id="bio"
                    type="name"
                    className={classnames("", {
                      invalid: errors.bio,
                    })}
                  />
                  <div className="row col">
                    <span className="red-text" style={{ color: "red" }}>
                      {errors.bio}
                    </span>
                  </div>
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
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
  }
}
ProfileForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(ProfileForm);
