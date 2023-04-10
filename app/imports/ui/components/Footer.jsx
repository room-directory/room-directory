import React from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Github } from 'react-bootstrap-icons';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  const white = { color: 'white', fontSize: '13px' };
  const green = { color: '#99EDC3', fontSize: '16px' };
  const line = { color: 'white' };
  return (
    <footer className="mt-auto bg-light text-center">
      <Container style={divStyle}>
        <Col>
          <Row>
            <Col style={{ paddingTop: '20px' }}>
              <Image src="/images/uh-logo.jpg" roundedCircle style={{ width: '80px' }} />
            </Col>
            <Col>
              <h6 style={green}>About Us</h6>
              <hr style={line} />
              <p style={white}>The goal of Room Directory is to create user friendly interface for office space management of the ICS department</p>
            </Col>
            <Col>
              <h6 style={green}>Useful Links</h6>
              <hr style={line} />
              <a href="https://room-directory.github.io/" className="text-white" style={white}>Room Directory Home Page</a>
              <br />
              <NavLink to="/faculty" className="text-white" style={white}>Faculty Information</NavLink>
              <br />
              <NavLink to="/club" className="text-white" style={white}>Club Information</NavLink>
            </Col>
            <Col>
              <h6 style={green}>Contact Us</h6>
              <hr style={line} />
              <a href="https://github.com/room-directory/room-directory" className="text-white" style={white}> <Github size={30} /> </a>
            </Col>
          </Row>
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
