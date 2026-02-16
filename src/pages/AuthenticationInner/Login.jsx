import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/Main.css";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  Label,
  FormFeedback,
  Alert,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

import App from "../../App";
import profile from "../../ambrella-white-logo.png";
import logo from "./../../ambrellfavicon.png";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  document.title = "Login | Amberlla Consultancy";

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),

    onSubmit: async (values) => {
      setApiError("");
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:8080/ords/demo123/users/getuser/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.status === "SUCCESS") {
          // ✅ Login success
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", values.username);
          navigate("/dashboard", { replace: true });
        } else {
          // ❌ Invalid credentials
          setApiError("Invalid username or password");
        }
      } catch (error) {
        console.error(error);
        setApiError("Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-tale">
                  <Row>
                    <Col className="col-7">
                      <div className="text-white p-4">
                        <h5>Welcome Back !</h5>
                        <p>Sign in to continue to Amberlla Consultancy.</p>
                      </div>
                    </Col>
                    <Col className="col-4 d-flex align-items-center">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>

                <CardBody className="pt-0">
                  <div className="auth-logo text-center mb-2">
                    <div className="avatar-md profile-user-wid">
                      <div className="avatar-title rounded-circle bg-white">
                        <img
                          src={logo}
                          alt=""
                          className="rounded-circle"
                          height="40"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* API ERROR */}
                    {apiError && <Alert color="danger">{apiError}</Alert>}

                    <Form
                      className="form-horizontal"
                      onSubmit={validation.handleSubmit}
                    >
                      {/* USERNAME */}
                      <div className="mb-3 text-tale">
                        <Label className="form-label">Username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username}
                          invalid={
                            validation.touched.username &&
                            !!validation.errors.username
                          }
                        />
                        <FormFeedback>
                          {validation.errors.username}
                        </FormFeedback>
                      </div>

                      {/* PASSWORD */}
                      <div className="mb-3 text-tale">
                        <Label className="form-label">Password</Label>
                        <div className="input-group auth-pass-inputgroup">
                          <Input
                            name="password"
                            type={show ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password}
                            invalid={
                              validation.touched.password &&
                              !!validation.errors.password
                            }
                          />
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => setShow(!show)}
                          >
                            <i className="mdi mdi-eye-outline"></i>
                          </button>
                        </div>
                        <FormFeedback>
                          {validation.errors.password}
                        </FormFeedback>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          type="submit"
                          className="btn-press bg-tale text-white p-2 rounded-3 fs-5 border-0"
                          disabled={loading}
                        >
                          {loading ? "Logging in..." : "Log In"}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/pages-forgot-pwd" className="text-muted">
                          <i className="mdi mdi-lock me-1" /> Forgot your
                          password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-5 text-center text-dark">
                <p>{new Date().getFullYear()} © Amberlla Consultancy.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Login;
