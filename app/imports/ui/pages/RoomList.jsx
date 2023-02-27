import React, { useState } from 'react';
import { Container, Row, Dropdown, DropdownButton, ButtonGroup, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Room } from '../../api/room/RoomCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import SvgComponent from '../components/SvgComponent';
import RoomListTableRow from '../components/RoomListTableRow';

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
  const [hoverRoom, setHoverRoom] = useState('default');

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
        <SvgComponent rooms={rooms} hoverRoom={hoverRoom} />
        <Table striped>
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
      </Row>
    </Container>
  )
    : <LoadingSpinner />
  );
};

export default RoomList;
