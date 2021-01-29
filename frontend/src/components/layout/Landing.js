import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
class Landing extends Component {
  render() {
    return (
      <Link to={"/login"} className="btn-flat waves-effect">
        <Button variant="outline-primary">Login</Button>
      </Link>
    );
  }
}
Landing.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(Landing);
