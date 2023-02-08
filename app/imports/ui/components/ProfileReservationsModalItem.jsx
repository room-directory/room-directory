import React from 'react';
import { Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

/* function to convert date */
function dateToTime(date) {
  const cDay = date.getDate();
  const cMonth = date.getMonth() + 1;
  const cYear = date.getFullYear();
  const cHour = date.getUTCHours();
  let cMin = date.getUTCMinutes();
  if (cMin < 10) { cMin = `0${cMin}`; }
  const ampm = cHour >= 12 ? 'pm' : 'am';

  return `${cMonth}/${cDay}/${cYear} ${cHour % 12}:${cMin} ${ampm}`;
}

/* Reservation item for the profile modal */
const ProfileReservationsModalItem = ({ reservation }) => (
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
};

export default ProfileReservationsModalItem;
