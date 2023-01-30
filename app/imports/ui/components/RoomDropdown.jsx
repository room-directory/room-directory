import React from 'react';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

const RoomDropdown = (
  { room },
) => (
  <Form.Select aria-label="Default select example">
    <option selected>Choose Room...</option>
    <option value={room._id}>{room.type}{room.roomNumber}</option>
    <option value="301">Room 301</option>
    <option value="302">Room 302</option>
    <option value="303">Room 303</option>
  </Form.Select>
  // <select className="custom-select" id="inputGroupSelect01">
  //   <option selected>Choose Room...</option>
  //   {/* <option value={room.roomNumber}>Room {room.roomNumber}</option> */}
  //   <option value="301">Room 301</option>
  //   <option value="302">Room 302</option>
  //   <option value="303">Room 303</option>
  // </select>
);

/* Referencing the Rooms Collection */
RoomDropdown.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default RoomDropdown;
