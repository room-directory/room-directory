import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import Slideshow from '../components/Slideshow';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <Container fluid id={PAGE_IDS.LANDING} className="p-0 m-0">
    <Row>
      <Slideshow />
    </Row>
    <Row className="text-center h-50" id="instruction">
      <Col>
        Room directory is cool and useful.
      </Col>
      <Col>
        Click on buttons to do things on website.
      </Col>
    </Row>
    <div />
  </Container>
);

export default Landing;
