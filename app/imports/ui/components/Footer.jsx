import React from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer className="mt-auto bg-light text-center">
      <Container style={divStyle}>
        <Col>
          <Row>
            <Col>
              <Image src="/images/uh-logo.jpg" roundedCircle />
            </Col>
            <Col>
              <a href="https://room-directory.github.io/" className="text-white">Room Directory Home Page</a>
            </Col>
            <Col>
              <a href="https://github.com/room-directory/room-directory" className="text-white">Contact Us</a>
            </Col>
            <Col>
              <NavLink to="/signup" className="text-white">Register</NavLink>
            </Col>
          </Row>
          <br />
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
