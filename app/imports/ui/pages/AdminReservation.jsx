import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

/* A simple static component to render some text for the landing page. */
const AdminReservation = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container id={PAGE_IDS.ADMIN_RESERVATION} className="py-3">
      <Row>
        <Col>
          <h3>Room 3xx</h3>
          <Button variant="primary" onClick={handleShow}>Make Reservation</Button>
          <h3>Room 3xx</h3>
          <Button variant="primary" onClick={handleShow}>Make Reservation</Button>
          <h3>Room 3xx</h3>
          <Button variant="primary" onClick={handleShow}>Make Reservation</Button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reserve Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control placeholder="Enter date" />
              <Form.Label>Date</Form.Label>

              <DatePicker
                  selected={values.date}
                  onChange={(e) => {
                    setFieldValue('date', e);
                    setFieldTouched('date');
                  }}
                  className="form-control"
                  minDate={today}
                  customInput={
                    <input
                        type="text"
                        id="validationCustom01"
                        placeholder="First name"
                    />
                  }
              />
              {touched.date && !!errors.date && errors.date}
            </Form.Group>
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control placeholder="Start" />
              <Form.Control placeholder="End" />
            </Form.Group>
            <Form.Group>
              <div>
                <Form.Check
                  type="checkbox"
                  id="recurrence-radio"
                  label="Recurring Event"
                />
                <Form.Check
                  label="Daily"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-1"
                />
                <Form.Check
                  label="Weekly"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-2"
                />
                <Form.Check
                  label="Monthly"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-3"
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control placeholder="First Name, Last Name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control placeholder="John@Foo.com" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminReservation;
