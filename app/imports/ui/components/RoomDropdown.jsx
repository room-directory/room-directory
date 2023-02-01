import React from 'react';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

const RoomDropdown = ({ room }) => (
  // <Form.Select aria-label="Default select example">
  //   <option selected>Choose Room...</option>
  //   {room.map(item => (
  //     <option value={item.type}>{item.id}{item.roomNumber}{item.capacity}</option>
  //   ))}
  // </Form.Select>

  <DropdownButton id="dropdown-item-button" title="Dropdown button">
    <Dropdown.Menu show>
       <Dropdown.Header>{room.type}</Dropdown.Header>
      <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
    </Dropdown.Menu>
    <
    <Dropdown.Menu show>
      <Dropdown.Header>{room.type}</Dropdown.Header>
      <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
    </Dropdown.Menu>
<Dropdown.Divider />

    <Dropdown.Menu show>
      <Dropdown.Header>{room.type}</Dropdown.Header>
      <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
    </Dropdown.Menu>
<Dropdown.Divider />
    <Dropdown.Menu show>
      <Dropdown.Header>{room.type}</Dropdown.Header>
      <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
    </Dropdown.Menu>
  </DropdownButton>
  // {/*//   const array = [room];*/}
  // {/*// try to put it in a boolean*/}
  // {/*// <ul>*/}
  // {/*//   <Dropdown.Header>Lecture</Dropdown.Header>*/}
  // {/*//   <Dropdown.Item >{}</Dropdown.Item>*/}
  // {/*// </ul>*/}

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
