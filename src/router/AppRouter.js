import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/Login/LoginPage";
import TuiCalendarTypeTwo from "../pages/Schedule/TuiCalendarTypeTwo";
import TuiCalendar from "../pages/Schedule/TuiCalendar";
import SchedulesTypes from "../pages/Schedule/SchedulesTypes";

const AppRouter = () => (
  <Router>
    <Switch>
      <PublicRoute path="/login" component={LoginPage} />
      <PrivateRoute path="/scheduleTwo" component={TuiCalendarTypeTwo} />
      <PrivateRoute path="/scheduleTypes" component={SchedulesTypes} />
      <PrivateRoute path="/calendar" component={TuiCalendar} />

      {/* Redirect all 404's to home */}
      <Redirect to='/calendar' />
    </Switch>
  </Router>
);

export default AppRouter;
