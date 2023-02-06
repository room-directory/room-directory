import React from 'react';
import { Container, Image, Row, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Room } from '../../api/room/RoomCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import RoomInfoModal from '../components/RoomInfoModal';

// const mockupRooms = [{ roomNumber: '001' }, { roomNumber: '002' }, { roomNumber: '003' }, { roomNumber: '004' }, { roomNumber: '005' }, { roomNumber: '006' }, { roomNumber: '007' },
//   { roomNumber: '008' }, { roomNumber: '009' }, { roomNumber: '010' }];

/* TODO: change key value */
const RoomList = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, rooms } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Room documents.
    const subscription = Room.subscribeRoom();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Room documents
    const roomItems = Room.find({}, {}).fetch();
    return {
      rooms: roomItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id={PAGE_IDS.ROOM_LIST} className="py-3">
      <Row>
        <ButtonGroup aria-label="Filter group">
          <DropdownButton variant="light" title="Building" className="border border-dark sharp me-3">
            <Dropdown.Item href="#/action-1">POST</Dropdown.Item>
          </DropdownButton>
          <DropdownButton variant="light" title="Floor" className="border border-dark sharp me-3">
            <Dropdown.Item href="#/action-1">3</Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
      </Row>
      <Row>
        <Image className="py-3" src="images/ICS3rdFloorDiagram.png" />
      </Row>
      <Row>
        {rooms.map((room) => <RoomInfoModal key={room.roomNumber} room={room} />)}
      </Row>
    </Container>
  )
    : <LoadingSpinner />
  );
};

export default RoomList;
