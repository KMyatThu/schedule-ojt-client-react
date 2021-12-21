import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Error from "../../components/Error";
import axios from "../../axios";
import { LOGIN_SUCCESS } from "../../store/actions/types";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit({ email, password }) {
    this.setState({
      errors: {}
    });

    const { dispatch } = this.props;
    const data = { email, password };

    await axios.post("auth/login", data)
      .then(res => {
        const { data } = res;
        const { token } = data;
        const { user } = data;

        /** store logged in user's info to local storage */
        localStorage.setItem(
          "user",
          JSON.stringify({
            accessToken: token,
            ...user
          })
        );

        /** store logged in user's info to App State */
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            user: {
              accessToken: token,
              ...user
            },
          }
        });
      })
      .then(() => this.props.history.push("/scheduleTypes"))
      .catch(error => {
        if (error.response) {
          console.error(error.response.data);
          if (error.response.data.errors) {
            this.setState({
              errors: error.response.data.errors
            });
          }
        }
      });
  }

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to="/" />;
    }

    return (
      <div className="sub-container">
        <h2>Login Form</h2>
        <div className="mb-3">
          <Error errors={this.state.errors} />
        </div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Required")
          })}
          onSubmit={values => {
            this.handleSubmit(values);
          }}
        >
          <Form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="form-control"
              />
              <div className="txt-error">
                <ErrorMessage name="email" />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                name="password"
                type="password"
                className="form-control"
              />
              <div className="txt-error">
                <ErrorMessage name="password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </Form>
        </Formik>
      </div>
    );
  }
}

const mapStateToProps = state => ({ isLoggedIn: state.auth.isLoggedIn });

export default connect(mapStateToProps)(Login);
