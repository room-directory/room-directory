import React, { useState } from 'react';
import { Container, Row, Dropdown, DropdownButton, ButtonGroup, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Room } from '../../api/room/RoomCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import SvgComponent from '../components/SvgComponent';
import RoomListTableRow from '../components/RoomListTableRow';

/* TODO: change key value */
const RoomList = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, rooms, faculty } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Room documents.
    const roomSubscription = Room.subscribeRoom();
    const facultySubscription = FacultyProfiles.subscribeFacultyProfile();
    // Determine if the subscription is ready
    const rdy = roomSubscription.ready() && facultySubscription.ready();
    // Get the Room documents
    const roomItems = Room.find({}, {}).fetch();
    const facultyList = FacultyProfiles.find({}, {}).fetch();
    return {
      rooms: roomItems,
      faculty: facultyList,
      ready: rdy,
    };
  }, []);
  const [hoverRoom, setHoverRoom] = useState('default');
  const [scale, setScale] = useState(1);
  const changeScale = () => {
    setScale(scale + 1);
    setScale((scale % 2) + 1);
  };
  return (ready ? (
    <Container id={PAGE_IDS.ROOM_LIST} className="py-3 overflow-hidden">
      <Row>
        <ButtonGroup aria-label="Filter group">
          <DropdownButton variant="primary" title="Building" className="sharp me-3">
            <Dropdown.Item href="#/action-1">POST</Dropdown.Item>
          </DropdownButton>
          <DropdownButton variant="primary" title="Floor" className=" sharp me-3">
            <Dropdown.Item href="#/action-1">3</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
        <Row>
          <ButtonGroup aria-label="Zoom group">
            <div className="mt-2">
              <Button className="btn btn-primary" onClick={() => changeScale()}>{scale === 1 ? 'Zoom in' : 'Zoom out'}</Button>
            </div>
          </ButtonGroup>

        </Row>
      </Row>
      <Row className="d-flex w-auto h-auto flex-nowrap">
        <div className="map-container" style={{ width: 870 }}>
          <SvgComponent rooms={rooms} hoverRoom={hoverRoom} scale={scale} facultyCollection={faculty} />
        </div>
        <div className="w-25 room-list-table">
          <Table responsive className="room-list-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Room type</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => <RoomListTableRow room={room} hoverRoom={hoverRoom} setHoverRoom={setHoverRoom} key={room._id} />)}
            </tbody>
          </Table>
        </div>
      </Row>
    </Container>
  )
    : <LoadingSpinner />
  );
};

export default RoomList;
