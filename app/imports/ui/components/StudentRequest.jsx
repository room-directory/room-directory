import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

/** Renders a single row in the List Student Request Table. See pages/ListStudentRequests.jsx. */
const StudentRequest = ({ studentRequest }) => (
  <tr>
    <td>{studentRequest.firstName} {studentRequest.lastName}</td>
    <td>{studentRequest.roomNumber}</td>
    <td>{studentRequest.date}</td>
    <td>{studentRequest.startTime}</td>
    <td>{studentRequest.endTime}</td>
    <td>{studentRequest.reason}</td>
    <td>{studentRequest.numPeople}</td>
    <td><Button variant="success">Approve</Button></td>
    <td><Button variant="danger">Decline</Button></td>
  </tr>
);

// Require a document to be passed to this component.
StudentRequest.propTypes = {
  studentRequest: PropTypes.shape({
    requestID: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    // email: PropTypes.string,
    roomNumber: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    date: Date,
    /* status: {
      type: String,
      allowedValues: requestStatus,
      defaultValue: 'pending faculty approval',
    }, */
    reason: PropTypes.string,
    numPeople: PropTypes.number,
  }).isRequired,
};

export default StudentRequest;
