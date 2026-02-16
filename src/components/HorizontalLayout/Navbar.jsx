import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";

import { connect } from "react-redux";
import "../../assets/css/Main.css";

const Navbar = (props) => {
  return (
    <React.Fragment>
      <div className="topnav px-0 ">
        <Container fluid>
          <nav className="navbarBody   ">
            <Link
              className="link-hover d-flex align-items-center  "
              to="/dashboard"
            >
              <i className="bx bx-home-circle fs-5 me-2"></i>
              {props.t("Dashboard")}
            </Link>

            <Link
              className="link-hover d-flex align-items-center  "
              to="/staffList"
            >
              <i className="bx bx-user fs-5 me-2"></i>
              {props.t("Staff")}
            </Link>

            <Link
              to="/resume"
              className="d-flex  align-items-center link-hover"
            >
              <i className="bx bxs-group fs-5 me-2"></i>
              {props.t("Resume")}
            </Link>
          </nav>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
