import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RoomInfoModal from './RoomInfoModal';
// import { UserProfiles } from '../../api/user/UserProfileCollection';

const RoomListTableRow = ({ room, setHoverRoom }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(false);
  const activeRoom = () => setHoverRoom(room.roomNumber);
  const leaveRoom = () => setHoverRoom('');
  return (
    <>
      <tr onClick={() => setShow(true)} onMouseEnter={activeRoom} onMouseLeave={leaveRoom}>
        <td>{room.roomNumber}</td>
        <td>{room.type}</td>
      </tr>
      <RoomInfoModal room={room} show={show} setShow={handleShow} key={room.roomNumber} />
    </>
  );
};

/* Referencing the Room Collection */
RoomListTableRow.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    building: PropTypes.string,
    type: PropTypes.string,
    ocupants: PropTypes.arrayOf(PropTypes.string),
    squareFt: PropTypes.number,
  }).isRequired,
  setHoverRoom: PropTypes.func.isRequired,
  // roomResource: PropTypes.shape({
  //   roomNumber: PropTypes.string,
  //   capacity: PropTypes.number,
  //   chairs: PropTypes.number,
  //   desks: PropTypes.number,
  //   phoneNumber: PropTypes.string,
  //   tv: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string, PropTypes.string)),
  //   dataJacks: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string, PropTypes.string)),
  // }).isRequired,
};

export default RoomListTableRow;
