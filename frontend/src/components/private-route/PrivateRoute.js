import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Dashboard from "../dashboard/Dashboard";
const PrivateRoute = ({ component: Component, role: role, auth, ...rest }) => (
  <Route
    {...rest}
    render={
      (props) => {
        if (auth.isAuthenticated) {
          console.log(auth.user.role);
          if (role === "either") {
            return <Component {...props} />;
          } else {
            if (auth.user.role === role) {
              return <Component {...props} />;
            } else {
              return <Redirect to="/dashboard" />;
            }
          }
        } else {
          return <Redirect to="/login" />;
        }
      }
      // auth.isAuthenticated === true ? (
      //   <Component {...props} />
      // ) : (
      //   <Redirect to="/login" />
      // )
    }
  />
);
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PrivateRoute);
