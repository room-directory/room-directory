import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const RoomInfoItem = ({ room }) => (
  <Button size="lg" variant="light" value={room.roomNumber} className="border border-dark sharp me-3">Room #{room.roomNumber}</Button>
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
