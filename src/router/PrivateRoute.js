import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Header from "../components/Header";

const PrivateRoute = ({ isLoggedIn, component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props =>
      isLoggedIn ? (
        <div>
          <Header {...props} />
          <div className="container">
            <Component {...props} />
          </div>
        </div>
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(PrivateRoute);
