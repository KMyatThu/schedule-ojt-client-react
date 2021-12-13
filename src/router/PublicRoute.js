import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import Header from "../components/Header";

const PublicRoute = ({ isLoggedIn, component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props => (
      <div className="container">
        <Header {...props} />
        <Component {...props} />
      </div>
    )}
  />
);

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(PublicRoute);
