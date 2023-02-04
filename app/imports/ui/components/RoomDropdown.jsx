import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const RoomDropdown = ({ room }) => (
  <div>
    <Dropdown.Item eventKey={room.type}>Room {room.roomNumber}</Dropdown.Item>
  </div>
);

/* Referencing the Rooms Collection */
RoomDropdown.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    capacity: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default RoomDropdown;
