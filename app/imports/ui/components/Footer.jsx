import React from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Github } from 'react-bootstrap-icons';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  const white = { color: 'white' };
  const green = { color: '#99EDC3' };
  return (
    <footer className="mt-auto bg-light text-center">
      <Container style={divStyle}>
        <Col>
          <Row>
            <Col>
              <Image src="/images/uh-logo.jpg" roundedCircle style={{ width: '135px' }} />
            </Col>
            <Col>
              <h4 style={green}>About Us</h4>
              <hr style={white} />
              <p style={green}>The goal of Room Directory is to create user friendly interface for office space management of the ICS department</p>
            </Col>
            <Col>
              <h4 style={green}>Useful Links</h4>
              <hr style={white} />
              <a href="https://room-directory.github.io/" className="text-white">Room Directory Home Page</a>
              <br />
              <NavLink to="/faculty" className="text-white">Faculty Information</NavLink>
              <br />
              <NavLink to="/club" className="text-white">Club Information</NavLink>
            </Col>
            <Col>
              <h4 style={green}>Contact Us</h4>
              <hr style={white} />
              <a href="https://github.com/room-directory/room-directory" className="text-white"> <Github size={30} /> </a>
            </Col>
          </Row>
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
