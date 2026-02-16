import sideImg from "../../assets/images/profile-img.png";
import { Container, Row, Col } from "reactstrap";
import { useState, useEffect } from "react";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import "../../assets/css/Main.css";

const Dashboard = (props) => {
  document.title = "Dashboard | Amberlla Consultancy";
  const [loading, setLoading] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    setLoading(true);
    delay(500).then(() => setLoading(false));
  }, []);

  return (
    <div className="page-content">
      {loading && (
        <div className="page-loader">
          <div className="page-loader-spinner"></div>
        </div>
      )}
      <Container fluid>
        <Breadcrumb
          title={props.t("Dashboards")}
          breadcrumbItem={props.t("Dashboard")}
        />

        {/* Dashboard Title */}
        <Row className="px-3 py-2 mb-5 ">
          <Col>
            <div className="d-inline-flex text-white gap-3 px-3 py-2 fs-7 fw-semibold bg-tale rounded-2 align-items-center cursor-pointer">
              Default Dashboard
              <button className="btn-pen">
                <i className="bx bxs-pencil fs-6 btn-press"></i>
              </button>
            </div>
          </Col>
        </Row>

        {/* Main Card */}
        <Row className="justify-content-center mt-5">
          <Col xs="9" lg="6" xl="6">
            <Row className="bg-white rounded-3 shadow-lg align-items-center">
              {/* LEFT IMAGE */}
              <Col xs="12" md="6" className="p-4 text-center">
                <img src={sideImg} alt="dashboard" className="img-fluid " />
              </Col>

              {/* RIGHT CONTENT */}
              <Col
                xs="12"
                md="6"
                className="d-flex flex-column justify-content-center text-center text-tale text-center p-4 fw-bold fs-5"
              >
                <p>Woohoo! 🎉 Your new tab is Added!</p>
                <p>
                  Customize your dashboard with the elements you need to do your
                  best work. 💼
                </p>
                <p>Ready to create your perfect view?</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withTranslation()(Dashboard);
