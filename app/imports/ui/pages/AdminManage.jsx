import React, { useState } from 'react';
import { Button, Container, Row, Col, Modal, Form, Tabs, Tab } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
import { Meteor } from 'meteor/meteor';
import DatePicker from 'react-datepicker';
import { Roles } from 'meteor/alanning:roles';
import { ROLE } from '../../api/role/Role';
import { PAGE_IDS } from '../utilities/PageIDs';
// import RoomDropdown from '../components/RoomDropdown';
import { Room } from '../../api/room/RoomCollection';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileTable from '../components/ProfileTable';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import RoomTable from '../components/RoomTable';
import AddUserModal from '../components/AddUserModal';
import FacultyTable from '../components/FacultyTable';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import AddFacultyModal from '../components/AddFacultyModal';
import { Club } from '../../api/club/ClubCollection';
import ClubTable from '../components/ClubTable';
import AddRoomModal from '../components/AddRoomModal';
import AddClubModal from '../components/AddClubModal';
import ImportCSV from '../components/ImportCSV';

/* An interactive page with different components that reflects the reservations made. */
const AdminManage = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showAddClub, setShowAddClub] = useState(false);
  const [showImportCSV, setShowImportCSV] = useState(false);

  const { rooms, profiles, facultyInfo, resources, clubs, ready, currUser, user } = useTracker(() => {
    const curUser = Meteor.user() ? Meteor.user().username : '';
    let usr = UserProfiles.findOne({ email: curUser }, {});
    if (usr === undefined) (usr = AdminProfiles.findOne({ email: curUser }, {}));

    const roomSubscription = Room.subscribeRoom();
    const profileSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const facultySubscription = FacultyProfiles.subscribeFacultyProfile();
    const resourcesSubscription = RoomResources.subscribeRoomResourceAdmin();
    const clubSubscription = Club.subscribeClub();
    // Determine if the subscription is ready
    const rdy = roomSubscription.ready() && profileSubscription.ready() && adminSubscription.ready() && facultySubscription.ready() && clubSubscription.ready() && resourcesSubscription.ready();
    const room = Room.find({}, {}).fetch();
    const resource = RoomResources.find({}, {}).fetch();
    const userp = UserProfiles.find({}, {}).fetch();
    const admin = AdminProfiles.find({}, {}).fetch();
    const profile = _.sortBy(userp.concat(admin), (obj) => obj.lastName);
    const faculty = FacultyProfiles.find({}, {}).fetch();
    const club = Club.find({}, {}).fetch();
    return {
      rooms: room,
      resources: resource,
      ready: rdy,
      profiles: profile,
      facultyInfo: faculty,
      clubs: club,
      currUser: curUser,
      user: usr,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.ADMIN_MANAGE} className="py-3 elevated-container">
      <Row className="d-flex">
        <Col style={{ width: '100%' }}>
          <Button variant="primary" onClick={handleShow} style={{ marginBottom: 10 }}>Make Reservation</Button>
          <Tabs
            defaultActiveKey="profiles"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            { (currUser !== '' && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN])) || (currUser !== '' && user?.position === 'office') ? (
              <Tab eventKey="profiles" title="Profiles">
                <Row className="px-m3 py-2" style={{ padding: 15 }}>
                  <Col><u>NAME</u></Col>
                  <Col><u>EMAIL</u></Col>
                  <Col><u>POSITION</u></Col>
                  <Col xs={2} />
                </Row>
                <div className="verticalScroll">
                  { profiles.map((account, index) => <ProfileTable key={account._id} eventKey={`${index}`} account={account} />) }
                </div>
                <Col className="d-flex justify-content-end">
                  <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
                    <Button variant="success" onClick={() => setShowAddUser(true)}>
                      + Add
                    </Button>
                  </div>
                </Col>
              </Tab>
            ) : ''}
            { currUser !== '' && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? ([
              <Tab eventKey="faculty" title="Faculty">
                <Row className="px-m3 py-2" style={{ padding: 15 }}>
                  <Col><u>NAME</u></Col>
                  <Col><u>EMAIL</u></Col>
                  <Col><u>TITLE</u></Col>
                  <Col><u>OFFICE</u></Col>
                  <Col xs={2} />
                </Row>
                <div className="verticalScroll">
                  { facultyInfo.map((faculty, index) => <FacultyTable key={faculty._id} eventKey={`${index}`} faculty={faculty} />) }
                </div>
                <Col className="d-flex justify-content-end">
                  <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
                    <Button variant="success" onClick={() => setShowAddFaculty(true)}>
                      + Add
                    </Button>
                  </div>
                </Col>
              </Tab>,
              // ) : ''}
              <Tab eventKey="rooms" title="Rooms">
                {/* <DropdownButton title="Select Room...">
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
              </DropdownButton> */}
                <Row className="px-m3 py-2" style={{ padding: 15 }}>
                  <Col><u>BUILDING</u></Col>
                  <Col><u>ROOM NUMBER</u></Col>
                  <Col><u>TYPE</u></Col>
                  <Col><u>FACULTY</u></Col>
                  <Col><u>IS ICS?</u></Col>
                  <Col><u>SQUARE FT</u></Col>
                  <Col xs={2} />
                </Row>
                <div className="verticalScroll">
                  { rooms.map((room, index) => <RoomTable key={room._id} eventKey={`${index}`} room={room} resources={resources.find(x => x.roomNumber === room.roomNumber)} faculty={facultyInfo} />) }
                </div>
                <Col className="d-flex justify-content-end">
                  <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
                    <Button variant="success" onClick={() => setShowAddRoom(true)}>
                      + Add
                    </Button>
                    <Button className="ms-2" variant="success" onClick={() => setShowImportCSV(true)}>
                      CSV Options
                    </Button>
                  </div>
                </Col>
              </Tab>,
              <Tab eventKey="clubs" title="Clubs">
                <Row className="px-m3 py-2" style={{ padding: 15 }}>
                  <Col><u>CLUB NAME</u></Col>
                  <Col xs={2} />
                </Row>
                <div>
                  { clubs.map((club, index) => <ClubTable key={club._id} eventKey={`${index}`} club={club} />) }
                </div>
                <Col className="d-flex justify-content-end">
                  <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
                    <Button variant="success" onClick={() => setShowAddClub(true)}>
                      + Add Club
                    </Button>
                  </div>
                </Col>
              </Tab>,
            ]) : ''}
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
      <AddUserModal setShowAddUser={setShowAddUser} showAddUser={showAddUser} />
      <AddFacultyModal setShowAddFaculty={setShowAddFaculty} showAddFaculty={showAddFaculty} />
      <AddRoomModal setShowAddRoom={setShowAddRoom} showAddRoom={showAddRoom} />
      <AddClubModal setShowAddClub={setShowAddClub} showAddClub={showAddClub} />
      <ImportCSV setShowImportCSV={setShowImportCSV} showImportCSV={showImportCSV} />
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminManage;
