import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker';
import { PAGE_IDS } from '../utilities/PageIDs';
import RoomDropdown from '../components/RoomDropdown';
import { Room } from '../../api/room/RoomCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileTable from '../components/ProfileTable';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

function RoomType(room) {
  const lecture = [];
  const office = [];
  const conference = [];
  const study = [];

  for (let i = 0; i < room.length; i++) {
    if (room[i].type === 'lecture') {
      lecture.push(room[i]);
    } else if (room[i].type === 'office') {
      office.push(room[i]);
    } else if (room[i].type === 'conference') {
      conference.push(room[i]);
    } else if (room[i].type === 'study room') {
      study.push(room[i]);
    }
  }
  // TO DO: Fix study room type
  const types = {
    lecture: lecture,
    office: office,
    conference: conference,
    study: study,
  };

  return types;
}

/* An interactive page with different components that reflects the reservations made. */
const AdminManage = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const { rooms, profiles, ready } = useTracker(() => {
    const roomSubscription = Room.subscribeRoom();
    const profileSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    // Determine if the subscription is ready
    const rdy = roomSubscription.ready() && profileSubscription.ready() && adminSubscription.ready();
    const room = Room.find({}).fetch();
    const user = UserProfiles.find({}, {}).fetch();
    const admin = AdminProfiles.find({}, {}).fetch();
    const profile = _.sortBy(user.concat(admin), (obj) => obj.lastName);
    return {
      rooms: room,
      ready: rdy,
      profiles: profile,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.ADMIN_MANAGE} className="py-3 elevated-container">
      <Row className="d-flex">
        <Col style={{ width: '100%' }}>
          <Button variant="primary" onClick={handleShow}>Make Reservation</Button>
          <Tabs
            defaultActiveKey="profiles"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="profiles" title="Profiles">

              <Row className="px-m3 py-2" style={{padding:15}}>
                <Col><u>LAST NAME</u></Col>
                <Col><u>FIRST NAME</u></Col>
                <Col><u>EMAIL</u></Col>
                <Col><u>POSITION</u></Col>
                <Col xs={2} />
              </Row>
              <div>
              { profiles.map((account, index) => <ProfileTable key={account} eventKey={`${index}`} account={account} />) }
              </div>
            </Tab>
            <Tab eventKey="rooms" title="Rooms">
              <DropdownButton title="Select Room...">
                <Dropdown.Header>Lecture</Dropdown.Header>
                {(RoomType(rooms).lecture).map((room) => <RoomDropdown key={room.type} room={room} />)}
                <Dropdown.Divider />
                <Dropdown.Header>Office</Dropdown.Header>
                {(RoomType(rooms).office).map((room) => <RoomDropdown key={room.type} room={room} />)}
                <Dropdown.Divider />
                <Dropdown.Header>Conference</Dropdown.Header>
                {(RoomType(rooms).conference).map((room) => <RoomDropdown key={room.type} room={room} />)}
                <Dropdown.Divider />
                <Dropdown.Header>Study Room</Dropdown.Header>
                {(RoomType(rooms).study).map((room) => <RoomDropdown key={room.type} room={room} />)}
              </DropdownButton>
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          {/* <Form inline className="mb-3"> */}
          {/*  <FormControl */}
          {/*    type="text" */}
          {/*    placeholder="Filter by name..." */}
          {/*    // value={} */}
          {/*    // onChange={} */}
          {/*  /> */}
          {/* </Form> */}
        </Col>
        <Col className="d-flex justify-content-end">
          <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
            <Button variant="success">
              + Add
            </Button>
          </div>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reserve Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date</Form.Label>
              <DatePicker required showIcon selected={startDate} dateFormat="MM/dd/yyyy" onChange={(date) => setStartDate(date)} />
            </Form.Group>
            <Form.Group>
              <Col>
                <Form.Label>Start time</Form.Label>
                <DatePicker required showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" selected={startTime} onChange={(time) => setStartTime(time)} />
                <Form.Label>End time</Form.Label>
                <DatePicker required showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" selected={endTime} onChange={(time) => setEndTime(time)} />
              </Col>

            </Form.Group>
            <Form.Group>
              <div>
                <Form.Check
                  type="checkbox"
                  id="recurrence-radio"
                  label="Recurring Event"
                />
                <Form.Check
                  label="Daily"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-1"
                />
                <Form.Check
                  label="Weekly"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-2"
                />
                <Form.Check
                  label="Monthly"
                  type="radio"
                  name="group1"
                  id="recurrence-radio-3"
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control placeholder="First Name, Last Name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>E-Mail</Form.Label>
              <Form.Control placeholder="John@Foo.com" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminManage;
