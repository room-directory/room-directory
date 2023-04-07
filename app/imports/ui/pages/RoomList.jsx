import React, { useState } from 'react';
import { Container, Row, Col, Dropdown, DropdownButton, ButtonGroup, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { BsZoomIn, BsZoomOut } from 'react-icons/bs';
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
  const [sortingBy, setSortingBy] = useState('roomNumber');
  const [category, setCategory] = useState('Room Number');
  rooms.sort(function (a, b) {
    return a[sortingBy].localeCompare(b[sortingBy]);
  });
  const handleZoomIn = () => {
    setScale(scale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(scale - 0.1);
  };
  return (ready ? (
    <Container id={PAGE_IDS.ROOM_LIST} className="py-3 overflow-hidden">
      <Row>
        <Col>
          <ButtonGroup aria-label="Filter group">
            <DropdownButton variant="primary" title="Building" className="sharp me-3">
              <Dropdown.Item href="#/action-1">POST</Dropdown.Item>
            </DropdownButton>
            <DropdownButton variant="primary" title="Floor" className=" sharp me-3">
              <Dropdown.Item href="#/action-1">3</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </Col>
        <Col style={{ textAlign: 'center' }}>
          <Button variant="primary" onClick={handleZoomIn}>
            <BsZoomIn />
          </Button>
          <Button variant="primary" onClick={handleZoomOut}>
            <BsZoomOut />
          </Button>
        </Col>
        <Col style={{ textAlign: 'center' }}>
          <DropdownButton variant="primary" title={`Sort by: ${category}`} className="sharp me-3">
            <Dropdown.Item href="#/action-1" onClick={() => { setSortingBy('roomNumber'); setCategory('Room Number'); }}>Room Number</Dropdown.Item>
            <Dropdown.Item href="#/action-1" onClick={() => { setSortingBy('type'); setCategory('Room Type'); }}>Room Type</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      <Row className="d-flex w-auto h-auto flex-nowrap" style={{ justifyContent: 'center' }}>
        <Col md={9} style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="map-container h-100" style={{ width: '100%', height: '100%', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
            <SvgComponent rooms={rooms} hoverRoom={hoverRoom} scale={scale} facultyCollection={faculty} style={{ transform: `scale(${scale})` }} />
          </div>
        </Col>
        <Col md={4}>
          <div className=" room-list-table" style={{ alignContent: 'flex-start', height: '70vh' }}>
            <Table responsive className="room-list-table">
              <thead style={{ position: 'sticky' }}>
                <tr>
                  <th>Room Number</th>
                  <th>Room type</th>
                </tr>
              </thead>
              <tbody style={{ overflowY: 'scroll' }}>
                {rooms.map((room) => <RoomListTableRow room={room} hoverRoom={hoverRoom} setHoverRoom={setHoverRoom} key={room._id} />)}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  )
    : <LoadingSpinner />
  );
};

export default RoomList;
