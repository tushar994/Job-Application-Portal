import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import ProfileForm from "./components/profiles/edit_profile";
import ProfileView from "./components/profiles/view_profile";

import JobForm from "./components/company_pages/JobForm";
import JobShow from "./components/company_pages/JobShow";
import JobApplicants from "./components/company_pages/JobApplicants";
import Accepted from "./components/company_pages/Accepted";

import JobList from "./components/applicant_pages/JobList";
import JobView from "./components/applicant_pages/JobView";
import SOP_create from "./components/applicant_pages/SOP";
// import Landing from "./components/layout/Landing";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/view_jobs" component={JobList} /> */}
            <Route exact path="/view_profile/:email" component={ProfileView} />
            {/* <Route exact path="/dashboard" component={Dashboard} /> */}
            <Switch>
              <PrivateRoute
                exact
                path="/dashboard"
                component={Dashboard}
                role="either"
              />
              <PrivateRoute
                exact
                path="/edit_profile"
                component={ProfileForm}
                role="either"
              />
              <PrivateRoute
                exact
                path="/create_job"
                component={JobForm}
                role="company"
              />
              <PrivateRoute
                exact
                path="/see_jobs"
                component={JobShow}
                role="company"
              />
              <PrivateRoute
                exact
                path="/see_applicants/:jobID"
                component={JobApplicants}
                role="company"
              />
              <PrivateRoute
                exact
                path="/accepted"
                component={Accepted}
                role="company"
              />
              <PrivateRoute
                exact
                path="/view_jobs"
                component={JobList}
                role="applicant"
              />
              <PrivateRoute
                exact
                path="/view_your_jobs"
                component={JobView}
                role="applicant"
              />
              <PrivateRoute
                exact
                path="/SOP_create/:jobID"
                component={SOP_create}
                role="applicant"
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
