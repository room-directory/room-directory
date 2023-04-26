import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RoomInfoModal from './RoomInfoModal';

const RoomListTableRow = ({ room, setHoverRoom }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(false);
  const activeRoom = () => setHoverRoom(room.roomNumber);
  const leaveRoom = () => setHoverRoom('');
  return (
    <>
      <tr style={{ width: '100%', textAlign: 'center' }} role="button" onClick={() => setShow(true)} onMouseEnter={activeRoom} onMouseLeave={leaveRoom}>
        <td style={{ width: '100%' }}>{room.roomNumber}</td>
        <td style={{ width: '100%' }}>{room.type}</td>
      </tr>
      <RoomInfoModal room={room} show={show} setShow={handleShow} key={room.roomNumber} style={{ display: 'flex', justifyContent: 'center' }} />
    </>
  );
};

/* Referencing the Room Collection */
RoomListTableRow.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    building: PropTypes.string,
    type: PropTypes.string,
    occupants: PropTypes.arrayOf(PropTypes.string),
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
