import React from 'react';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const StudentRequests = () => (
  <Container id={PAGE_IDS.STUDENT_REQUESTS} className="py-3">
    <Row className="justify-content-center">
      <Col md={10}>
        <Col className="text-center">
          <h2>Student Requests Review Page</h2>
        </Col>
        <Table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Room Number</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Reason</th>
              <th>Number of People</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Student A</td>
              <td>319</td>
              <td>1/1/2023</td>
              <td>16:00</td>
              <td>17:00</td>
              <td>Project Meeting</td>
              <td>5</td>
              <td><Button variant="success">Approve</Button></td>
              <td><Button variant="danger">Decline</Button></td>
            </tr>
            <tr>
              <td>Student B</td>
              <td>319</td>
              <td>1/1/2023</td>
              <td>16:00</td>
              <td>17:00</td>
              <td>Class Study Session</td>
              <td>6</td>
              <td><Button variant="success">Approve</Button></td>
              <td><Button variant="danger">Decline</Button></td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  </Container>
);

export default StudentRequests;
