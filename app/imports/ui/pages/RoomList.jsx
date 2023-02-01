import React from 'react';
import { Container, Image, Row, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';
// import RoomInfoItem from '../components/RoomInfoItem';
import { PAGE_IDS } from '../utilities/PageIDs';
import RoomInfoModal from '../components/RoomInfoModal';

const mockupRooms = [{roomNumber: '301' }, {roomNumber: '302' }, {roomNumber: '303A' }, {roomNumber: '303B' }, {roomNumber: '303C' }, {roomNumber: '303D' }, {roomNumber: '303E' }, {roomNumber: '303F' }, {roomNumber: '303G' }, {roomNumber: '303-1' }, {roomNumber: '303-2' }, {roomNumber: '303-3' }, {roomNumber: '303-4' }, {roomNumber: '303-5' }, {roomNumber: '303.0' }, {roomNumber: '305A' }, {roomNumber: '305B' }, {roomNumber: '305C' }, {roomNumber: '305D' }, {roomNumber: '305E' }, {roomNumber: '305F' }, {roomNumber: '305G' }, {roomNumber: '306A' }, {roomNumber: '306B' }, {roomNumber: '306C' }, {roomNumber: '306D' }, {roomNumber: '307A' }, {roomNumber: '307B' }, {roomNumber: '307C' }, {roomNumber: '309A' }, {roomNumber: '309B' }, {roomNumber: '309C' }, {roomNumber: '309D' }, {roomNumber: '310A' }, {roomNumber: '310B' }, {roomNumber: '310C' }, {roomNumber: '311' }, {roomNumber: '312A' }, {roomNumber: '312B' }, {roomNumber: '312C' }, {roomNumber: '314A' }, {roomNumber: '314B' }, {roomNumber: '314C' }, {roomNumber: '314D' }, {roomNumber: '314E' }, {roomNumber: '314F' }, {roomNumber: '314G' }, {roomNumber: '314H' }, {roomNumber: '314I' }, {roomNumber: '314-1' }, {roomNumber: '314-2' }, {roomNumber: '314-3' }, {roomNumber: '314-4' }, {roomNumber: '314-5' }, {roomNumber: '314-6' }, {roomNumber: '314-7' }, {roomNumber: '314-8' }, {roomNumber: '314-9' }, {roomNumber: '314-10' }, {roomNumber: '315' }, {roomNumber: '316' }, {roomNumber: '317' }, {roomNumber: '318A' }, {roomNumber: '318B' }, {roomNumber: '319' }, {roomNumber: '320' }, {roomNumber: '326' }, {roomNumber: '327' }, {roomNumber: '328' }, {roomNumber: '332' }];

/* TODO: change key value */
const RoomList = () => (
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
      {mockupRooms.map((room) => <RoomInfoModal key={room.roomNumber} room={room} />)}
    </Row>
  </Container>
);

export default RoomList;
