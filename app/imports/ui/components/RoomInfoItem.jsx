import React from 'react';
import PropTypes from 'prop-types';
import { Col, Button } from 'react-bootstrap';

const RoomInfoItem = ({ room }) => (
  <Col className="col-2 pb-4">
    <Button size="lg" variant="light" value={room.roomNumber} className="border border-dark sharp me-3">Room #{room.roomNumber}</Button>
  </Col>
);

/* Referencing the Rooms Collection */
RoomInfoItem.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default RoomInfoItem;
