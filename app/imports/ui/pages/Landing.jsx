import React from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import Slideshow from '../components/Slideshow';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container fluid id={PAGE_IDS.LANDING} className="p-0 m-0">
    <Row>
      <Slideshow />
    </Row>
    <Row className="text-center justify-content-center">
      <div>
        <Button href="#instruction" className="rounded-pill green-background">How to navigate</Button>
      </div>
    </Row>
    <Row className="text-center min-vh-100" id="instruction">
      <Col>
        Room directory is cool and useful.
      </Col>
      <Col>
        Click on buttons to do things on website.
      </Col>
    </Row>
  </Container>
);

export default Landing;
