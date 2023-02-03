import React from 'react';
import Form from 'react-bootstrap/Form';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';

// function RoomType(room) {
//   const lecture = [];
//   const office = [];
//   const conference = [];
//   const study = [];
//   console.log(room);
//   if (room.type === 'lecture') {
//     lecture.push(room);
//   } else if (room.type === 'office') {
//     office.push(room);
//   } else if (room.type === 'conference') {
//     conference.push(room);
//   } else {
//     study.push(room);
//   }
//
//   const types = {
//     lecture: lecture,
//     office: office,
//     conference: conference,
//     study: study,
//   };
//   console.log(lecture);
//   return types;
// }

const RoomDropdown = ({ room }) => (
  // console.log("inside component", room)
  // <Form.Select aria-label="Default select example">
  //   <option selected>Choose Room...</option>
  //   {room.map(item => (
  //     <option value={item.type}>{item.id}{item.roomNumber}{item.capacity}</option>
  //   ))}
  // </Form.Select>

  // <DropdownButton id="dropdown-item-button" title="Dropdown button">

  // <Dropdown.Menu show>
  //   <Dropdown.Header>Lecture</Dropdown.Header>
  //   {/* <Dropdown.Item eventKey={room.type}>Room {room.roomNumber}</Dropdown.Item> */}
  //   {(RoomType(room).lecture).map(item => (
  <div>
    {/* {room.type.map(item => (<Dropdown.Item eventKey={item._id}>{item.roomNumber} ({item.capacity})</Dropdown.Item>))} */}
    <Dropdown.Item eventKey={room.type}>Room {room.roomNumber}</Dropdown.Item>
  </div>

  // <Dropdown.Divider />
  //   <Dropdown.Header>Office</Dropdown.Header>
  //   <Dropdown.Item eventKey={room.type}>Room {room.roomNumber}</Dropdown.Item>
  //   <Dropdown.Divider />
  //   <Dropdown.Header>Conference</Dropdown.Header>
  //   <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
  //   <Dropdown.Divider />
  //   <Dropdown.Header>Study Room</Dropdown.Header>
  //   <Dropdown.Item eventKey={room._id}>Room {room.roomNumber}</Dropdown.Item>
  // </Dropdown.Menu>
  // </DropdownButton>

  //   const array = [room]
  // try to put it in a boolean
  //  <ul>
  //    <Dropdown.Header>Lecture</Dropdown.Header>
  //    <Dropdown.Item >{}</Dropdown.Item>
  //  </ul>

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
