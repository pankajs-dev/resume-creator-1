import React from "react";
import { Row, Col, Container } from "reactstrap";

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer ">
        <Container fluid>
          <h6 className="px-1 text-secondary">
            {new Date().getFullYear()} © Amberlla Consultancy.
          </h6>
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
