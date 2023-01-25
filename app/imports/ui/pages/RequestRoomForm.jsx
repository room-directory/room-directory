import React from 'react';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { TextField } from 'uniforms-bootstrap5';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders the RequestRoomForm page for student to reserve a room. */
const RequestRoomForm = () => (
  <Container id={PAGE_IDS.STUDENT_REQUESTS} className="py-3">
    <Row className="justify-content-center">
      <Col md={10}>
        <Col className="text-center">
          <h2>Student Request Room Form</h2>
        </Col>
        <Card>
          <Card.Body>
            <Row>
              <Col xs={4}>First Name</Col>
              <Col xs={4}>Last Name</Col>
              <Col xs={4}>Student Email</Col>
            </Row>
            <hr />
            <Row>
              <Col>Recipients (Dropdown List of Faculties)</Col>
            </Row>
            <hr />
            <Row>
              <Col xs={4}>Date</Col>
              <Col xs={4}>Start Time</Col>
              <Col xs={4}>End Time</Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6}>Room Number</Col>
              <Col xs={6}>Number of People Attending</Col>
            </Row>
            <hr />
            <Row>
              <Col>What will you be using this room for?</Col>
            </Row>
            <hr />
            <Row>
              <Col className="text-center">Submit</Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default RequestRoomForm;
