import React from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer className="mt-auto bg-light">
      <Container style={divStyle}>
        <Col className="text-center">
          <Image src="/images/uh-logo.jpg" roundedCircle />
          <Row>
            <br />
            <Col>
              <a href="http://ics-software-engineering.github.io/meteor-application-template-production">Room Directory Home Page</a>
            </Col>
            <Col>
              <a href="https://github.com/room-directory/room-directory">Contact Us</a>
            </Col>
            <Col>
              <NavLink to="/signup">Register</NavLink>
            </Col>
          </Row>
          <br />
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
