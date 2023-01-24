import React from 'react';
import { Container, Image, Row, Dropdown, DropdownButton, ButtonGroup, Button } from 'react-bootstrap';
import RoomInfoItem from '../components/RoomInfoItem';
import { PAGE_IDS } from '../utilities/PageIDs';

const mockupRooms = [{ roomNumber: '001' }, { roomNumber: '002' }, { roomNumber: '003' }, { roomNumber: '004' }, { roomNumber: '005' }];

/* A simple static component to render some text for the landing page. */
const RoomList = () => {
  const handleClick = (e) => {
    console.log(e.target.value);
  };

  return (
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
        <Image className="py-3" src="https://s3.studylib.net/store/data/008760066_1-87f59ec4ef3268fd5d1c8de9e355c1b9.png" />
      </Row>
      <Row>
        <ButtonGroup aria-label="Room List group" className="" onClick={handleClick}>
          {mockupRooms.map((room) => <RoomInfoItem key={room.roomNumber} room={room} />)}
        </ButtonGroup>
      </Row>
    </Container>
  );
};

export default RoomList;
