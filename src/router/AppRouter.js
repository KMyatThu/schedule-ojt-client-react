import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/Login/LoginPage";
import TuiCalendar from "../pages/Schedule/TuiCalendar";

const AppRouter = () => (
  <Router>
    <Switch>
      <PublicRoute path="/login" component={LoginPage} />
      <PrivateRoute path="/calendar" component={TuiCalendar} />

      {/* Redirect all 404's to home */}
      <Redirect to='/calendar' />
    </Switch>
  </Router>
);

export default AppRouter;
