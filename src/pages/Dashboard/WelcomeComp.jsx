import React from "react";

import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import avatar1 from "../../assets/images/users/avatar-6.jpg";
import profileImg from "../../assets/images/profile-img.png";

const WelcomeComp = () => {
  return (
    <React.Fragment>
      <Card className="overflow-hidden " >
        <div className="bg-soft" style={{ background: "#01536E" }}>
          <Row>
            <Col xs="7">
              <div className="text-white p-3">
                <h5>Welcome Back !</h5>
                <p>Amberlla Dashboard</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>
        <CardBody className="pt-0">
          <Row>
            <Col sm="6">
              <div className="avatar-md profile-user-wid mb-4">
                <img
                  src={avatar1}
                  alt=""
                  className="img-thumbnail rounded-circle"
                />
              </div>
              <h5 className="font-size-15 text-truncate">Pankaj Sharma</h5>
              <p className="text-muted mb-0 text-truncate">
                Software Developer
              </p>
            </Col>

            <Col sm="6">
              <div className="pt-4">
                <Row>
                  <Col xs="6">
                    <h5 className="font-size-15">125</h5>
                    <p className="text-muted mb-0">Projects</p>
                  </Col>
                  <Col xs="6">
                    <h5 className="font-size-15">$1245</h5>
                    <p className="text-muted mb-0">Revenue</p>
                  </Col>
                </Row>
                <div className="mt-4">
                  <button
                    className="btn text-white btn-sm"
                    style={{ background: "#01536E" }}
                  >
                    View Profile <i className="mdi mdi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
export default WelcomeComp;
