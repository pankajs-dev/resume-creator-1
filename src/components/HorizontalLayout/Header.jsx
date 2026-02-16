import React, { useState } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Link } from "react-router-dom";

import "../../assets/css/Main.css";
// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions";
// reactstrap
import { Container } from "reactstrap";

import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

import logoLight from "../../assets/images/ambrella-white-logo.png";

//i18n
import { withTranslation } from "react-i18next";

const Header = (props) => {
  return (
    <React.Fragment>
      <header id="page-topbar">
        <Container fluid>
          <div className="bg-tale d-flex justify-content-between align-items-center px-3 ">
            <div>
              <Link to="/dashboard" className="px-2">
                <img src={logoLight} alt="" className="headerLogo " />
              </Link>
            </div>

            <div className="d-flex">
              <ProfileMenu />
              <NotificationDropdown />

              {/*
              <div className="dropdown d-inline-block">
                <button
                  onClick={() => {
                    props.showRightSidebarAction(!props.showRightSidebar);
                  }}
                  type="button"
                  className="btn header-item noti-icon right-bar-toggle "
                >
                  <i className="bx bx-cog bx-spin" />
                </button>
              </div>
           */}
            </div>
          </div>
        </Container>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header));
