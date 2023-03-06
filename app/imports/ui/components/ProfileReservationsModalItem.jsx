import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

/* Reservation item for the profile modal */
const ProfileReservationsModalItem = ({ reservation, dateToTime }) => (
  <Col>
    Name: {reservation.firstName} {reservation.lastName} <br />
    Room: #{reservation.roomNumber} <br />
    Start: {dateToTime(reservation.startTime)}<br />
    End: {dateToTime(reservation.endTime)}
  </Col>
);

ProfileReservationsModalItem.propTypes = {
  reservation: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    roomNumber: PropTypes.string,
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
    _id: PropTypes.string,
  }).isRequired,
  dateToTime: PropTypes.func.isRequired,
};

export default ProfileReservationsModalItem;
