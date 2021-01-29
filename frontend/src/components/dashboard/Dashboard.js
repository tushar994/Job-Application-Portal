import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Button } from "react-bootstrap";
class Dashboard extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    const { user } = this.props.auth;
    if (this.props.auth.user.role === "company") {
      return (
        <div>
          <div style={{ height: "75vh" }} className="container valign-wrapper">
            <div className="row">
              <div className="col s12 center-align">
                <h4>
                  <b>Hey there,</b> {user.name.split(" ")[0]}
                </h4>
                {/* either */}
                {/* view profile */}
                <div className="col">
                  <Link
                    to={"/view_profile/" + this.props.auth.user.email}
                    className="btn-flat waves-effect"
                  >
                    <Button variant="outline-primary">view profile</Button>
                  </Link>
                </div>
                {/* edit profile */}
                <div className="col">
                  <Link to={"/edit_profile"} className="btn-flat waves-effect">
                    <Button variant="outline-primary">edit profile</Button>
                  </Link>
                </div>
                {/* Company */}
                {/* create A new Job */}
                <div className="col">
                  <Link to={"/create_job"} className="btn-flat waves-effect">
                    <Button variant="outline-primary">Create A New Job</Button>
                  </Link>
                </div>
                {/* See all current jobs */}
                <div className="col">
                  <Link to={"/see_jobs"} className="btn-flat waves-effect">
                    <Button variant="outline-primary">
                      See All Existing Jobs
                    </Button>
                  </Link>
                </div>
                {/* See all employees */}
                <div className="col">
                  <Link to={"/accepted"} className="btn-flat waves-effect">
                    <Button variant="outline-primary">See All Employees</Button>
                  </Link>
                </div>
                <Button
                  variant="outline-dark"
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  onClick={this.onLogoutClick}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ height: "75vh" }} className="container valign-wrapper">
            <div className="row">
              <div className="col s12 center-align">
                <h4>
                  <b>Hey there,</b> {user.name.split(" ")[0]}
                </h4>
                {/* either */}
                {/* view profile */}
                <div className="col">
                  <Link
                    to={"/view_profile/" + this.props.auth.user.email}
                    className="btn-flat waves-effect"
                  >
                    <Button variant="outline-primary">view profile</Button>
                  </Link>
                </div>
                {/* edit profile */}
                <div className="col">
                  <Link to={"/edit_profile"} className="btn-flat waves-effect">
                    <Button variant="outline-primary">edit profile</Button>
                  </Link>
                </div>
                {/* Applicant */}
                {/* view all jobs */}
                <div className="col">
                  <Link to={"/view_jobs"} className="btn-flat waves-effect">
                    <Button variant="outline-primary">View All Jobs</Button>
                  </Link>
                </div>
                {/* view jobs apps */}
                <div className="col">
                  <Link
                    to={"/view_your_jobs"}
                    className="btn-flat waves-effect"
                  >
                    <Button variant="outline-primary">
                      View your applications
                    </Button>
                  </Link>
                </div>

                <Button
                  variant="outline-dark"
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  onClick={this.onLogoutClick}
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(Dashboard);
