import React from 'react';
import Form from 'react-bootstrap/Form';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const RoomDropdown = ({ room }) => (
  // <Form.Select aria-label="Default select example">
  //   <option selected>Choose Room...</option>
  //   {room.map(item => (
  //     <option value={item.type}>{item.id}{item.roomNumber}{item.capacity}</option>
  //   ))}
  // </Form.Select>

  // <DropdownButton id="dropdown-item-button" title="Dropdown button">
  <Dropdown.Menu show>
    <Dropdown.Header as={room.type}>{room.type}</Dropdown.Header>
    {/* {room.map(item => ( */}
    {/*  <Dropdown.Item eventKey={item._id} as={item.type}>{item.roomNumber}</Dropdown.Item> */}
    {/* ))} */}

    <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
  </Dropdown.Menu>

);

// const num= roomType.map((room) => <Dropdown.Item eventKey={room._id}>{room.type} {room.roomNumber}({room.capacity}) </Dropdown.Item>);

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
