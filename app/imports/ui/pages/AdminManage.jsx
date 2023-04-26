import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Tabs, Tab, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import Dropdown from 'react-bootstrap/Dropdown';
import { Meteor } from 'meteor/meteor';
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
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/* An interactive page with different components that reflects the reservations made. */
const AdminManage = () => {
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
  let profilesList = profiles;
  let facultyList = facultyInfo;
  let roomsList = rooms;
  let clubsList = clubs;
  // create sorting method
  const [sortingProfilesBy, setSortingProfilesBy] = useState('lastName');
  const [sortingFacultyBy, setSortingFacultyBy] = useState('lastName');
  const [sortingRoomsBy, setSortingRoomsBy] = useState('building');
  const [sortingClubsBy, setSortingClubsBy] = useState('clubName');
  const [profileCategory, setProfileCategory] = useState('Last Name');
  const [facultyCategory, setFacultyCategory] = useState('Last Name');
  const [roomCategory, setRoomCategory] = useState('Building');
  const [clubCategory, setClubCategory] = useState('Club Name');
  const [filteredProfiles, setFilteredProfiles] = useState(false);
  const [filteredFaculty, setFilteredFaculty] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState(false);
  const [filteredClubs, setFilteredClubs] = useState(false);
  const [currentTab, setCurrentTab] = useState('Profiles');
  const [searchProfiles, setSearchProfiles] = useState('');
  const [searchFaculty, setSearchFaculty] = useState('');
  const [searchRooms, setSearchRooms] = useState('');
  const [searchClubs, setSearchClubs] = useState('');
  if (currentTab === 'Profiles' && filteredProfiles) {
    profilesList = profiles.filter((profile) => `${profile.firstName} ${profile.lastName} ${profile.position} ${profile.email}`.toLowerCase().includes(searchProfiles.toLowerCase()));
  } else if (currentTab === 'Faculty' && filteredFaculty) {
    facultyList = facultyInfo.filter((faculty) => `${faculty.firstName} ${faculty.lastName} ${faculty.role} ${faculty.officeLocation}`.toLowerCase().includes(searchFaculty.toLowerCase()));
  } else if (currentTab === 'Rooms' && filteredRooms) {
    roomsList = rooms.filter((room) => `${room.building} ${room.roomNumber} ${room.type} ${room.occupants} ${room.isICS} ${room.squareFt}`.toLowerCase().includes(searchRooms.toLowerCase()));
  } else if (currentTab === 'Clubs' && filteredClubs) {
    clubsList = clubs.filter((club) => `${club.clubName}`.toLowerCase().includes(searchClubs.toLowerCase()));
  }
  profilesList.sort(function (a, b) {
    if (a[sortingProfilesBy] === b[sortingProfilesBy] || (Array.isArray(a[sortingProfilesBy]) && Array.isArray(b[sortingProfilesBy]) && a[sortingProfilesBy][0] === b[sortingProfilesBy][0])) {
      return a.lastName.localeCompare(b.lastName);
    }
    if (['Not Available', 'No Email Contact', 'No Phone Contact', 'Unknown'].includes(a[sortingProfilesBy])) {
      return 1;
    }
    if (['Not Available', 'No Email Contact', 'No Phone Contact', 'Unknown'].includes(b[sortingProfilesBy])) {
      return -1;
    }
    return a[sortingProfilesBy].localeCompare(b[sortingProfilesBy]);
  });

  facultyList.sort(function (a, b) {
    if (a[sortingFacultyBy] === b[sortingFacultyBy] || (Array.isArray(a[sortingFacultyBy]) && Array.isArray(b[sortingFacultyBy]) && a[sortingFacultyBy][0] === b[sortingFacultyBy][0])) {
      return a.lastName.localeCompare(b.lastName);
    }
    if (['Not Available', 'No Email Contact', 'No Phone Contact', 'Unknown'].includes(a[sortingFacultyBy]) || a[sortingFacultyBy][0] === 'Not Available' || a[sortingFacultyBy].length === 0) {
      return 1;
    }
    if (['Not Available', 'No Email Contact', 'No Phone Contact', 'Unknown'].includes(b[sortingFacultyBy]) || b[sortingFacultyBy][0] === 'Not Available' || b[sortingFacultyBy].length === 0) {
      return -1;
    }
    if (['phone', 'officeLocation'].includes(sortingFacultyBy)) {
      return a[sortingFacultyBy][0].localeCompare(b[sortingFacultyBy][0]);
    }
    return a[sortingFacultyBy].localeCompare(b[sortingFacultyBy]);
  });

  roomsList.sort(function (a, b) {
    if (a[sortingRoomsBy] === b[sortingRoomsBy] || (Array.isArray(a[sortingRoomsBy]) && Array.isArray(b[sortingRoomsBy]) && a[sortingRoomsBy][0] === b[sortingRoomsBy][0])) {
      return a.roomNumber.localeCompare(b.roomNumber);
    }
    if (sortingRoomsBy === 'occupants' && a.occupants.length === 0) {
      return 1;
    }
    if (sortingRoomsBy === 'occupants' && b.occupants.length === 0) {
      return -1;
    }
    if (sortingRoomsBy === 'occupants') {
      return a.occupants[0].localeCompare(b.occupants[0]);
    }
    return a[sortingRoomsBy].localeCompare(b[sortingRoomsBy]);
  });

  clubsList.sort((a, b) => a[sortingClubsBy].localeCompare(b[sortingClubsBy]));

  function showProfileTab() {
    return (
      <Tab eventKey="profiles" title="Profiles" onSelect={() => setCurrentTab('Profiles')}>
        <Row>
          <Col style={{ display: 'flex' }}>
            <DropdownButton id={COMPONENT_IDS.ADMIN_MANAGE_PROFILE_SORT} title={`Sort by: ${profileCategory}`}>
              <Dropdown.Item onClick={() => { setSortingProfilesBy('firstName'); setProfileCategory('First Name'); }}>First Name</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingProfilesBy('lastName'); setProfileCategory('Last Name'); }}>Last Name</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingProfilesBy('email'); setProfileCategory('Email'); }}>Email</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingProfilesBy('position'); setProfileCategory('Position'); }}>Position</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs={4} style={{ justifyContent: 'end' }}>
            <InputGroup id={COMPONENT_IDS.ADMIN_MANAGE_PROFILE_SEARCH} className="mb-3">
              <Form.Control aria-label="Name" placeholder="Search for profile" onChange={(e) => { setSearchProfiles(e.target.value); setFilteredProfiles(true); }} value={searchProfiles} />
              <Button onClick={() => { setFilteredProfiles(false); setSearchProfiles(''); }}>Clear</Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="px-m3 py-2" style={{ padding: 15 }}>
          <Col><u>NAME</u></Col>
          <Col><u>EMAIL</u></Col>
          <Col><u>POSITION</u></Col>
          <Col xs={2} />
        </Row>
        <div className="verticalScroll">
          { profilesList.map((account, index) => <ProfileTable key={account._id} eventKey={`${index}`} account={account} />) }
        </div>
        <Col className="d-flex justify-content-end">
          <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
            <Button variant="success" onClick={() => setShowAddUser(true)}>
              + Add
            </Button>
          </div>
        </Col>
      </Tab>
    );
  }

  function showRoomTab() {
    return (
      <Tab eventKey="rooms" title="Rooms" onSelect={() => setCurrentTab('Rooms')}>
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
        <Row>
          <Col style={{ display: 'flex' }}>
            <DropdownButton id={COMPONENT_IDS.ADMIN_MANAGE_ROOM_SORT} title={`Sort by: ${roomCategory}`}>
              <Dropdown.Item onClick={() => { setSortingRoomsBy('building'); setRoomCategory('Building'); }}>Building</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingRoomsBy('roomNumber'); setRoomCategory('Room Number'); }}>Room Number</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingRoomsBy('type'); setRoomCategory('Type'); }}>Type</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingRoomsBy('occupants'); setRoomCategory('Faculty'); }}>Faculty</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingRoomsBy('isICS'); setRoomCategory('Is ICS?'); }}>Is ICS</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingRoomsBy('squareft'); setRoomCategory('Square Ft'); }}>Square Ft</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs={4} style={{ justifyContent: 'end' }}>
            <InputGroup id={COMPONENT_IDS.ADMIN_MANAGE_ROOM_SEARCH} className="mb-3">
              <Form.Control aria-label="Name" placeholder="Search for room" onChange={(e) => { setSearchRooms(e.target.value); setFilteredRooms(true); }} value={searchRooms} />
              <Button onClick={() => { setFilteredRooms(false); setSearchRooms(''); }}>Clear</Button>
            </InputGroup>
          </Col>
        </Row>
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
          { roomsList.map((room, index) => <RoomTable key={room._id} eventKey={`${index}`} room={room} resources={resources.find(x => x.roomNumber === room.roomNumber)} faculty={facultyInfo} />) }
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
      </Tab>
    );
  }

  function showFacultyTab() {
    return (
      <Tab eventKey="faculty" title="Faculty" onSelect={() => setCurrentTab('Faculty')}>
        <Row>
          <Col style={{ display: 'flex' }}>
            <DropdownButton id={COMPONENT_IDS.ADMIN_MANAGE_FACULTY_SORT} title={`Sort by: ${facultyCategory}`}>
              <Dropdown.Item onClick={() => { setSortingFacultyBy('firstName'); setFacultyCategory('First Name'); }}>First Name</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingFacultyBy('lastName'); setFacultyCategory('Last Name'); }}>Last Name</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingFacultyBy('role'); setFacultyCategory('Title'); }}>Title</Dropdown.Item>
              <Dropdown.Item onClick={() => { setSortingFacultyBy('officeLocation'); setFacultyCategory('Office'); }}>Office</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs={4} style={{ justifyContent: 'end' }}>
            <InputGroup id={COMPONENT_IDS.ADMIN_MANAGE_FACULTY_SEARCH} className="mb-3">
              <Form.Control aria-label="Name" placeholder="Search for faculty" onChange={(e) => { setSearchFaculty(e.target.value); setFilteredFaculty(true); }} value={searchFaculty} />
              <Button onClick={() => { setFilteredFaculty(false); setSearchFaculty(''); }}>Clear</Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="px-m3 py-2" style={{ padding: 15 }}>
          <Col><u>NAME</u></Col>
          <Col><u>EMAIL</u></Col>
          <Col><u>TITLE</u></Col>
          <Col><u>OFFICE</u></Col>
          <Col xs={2} />
        </Row>
        <div className="verticalScroll">
          { facultyList.map((faculty, index) => <FacultyTable key={faculty._id} eventKey={`${index}`} faculty={faculty} rooms={roomsList} />) }
        </div>
        <Col className="d-flex justify-content-end">
          <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
            <Button variant="success" onClick={() => setShowAddFaculty(true)}>
              + Add
            </Button>
          </div>
        </Col>
      </Tab>
    );
  }

  function showClubTab() {
    return (
      <Tab eventKey="clubs" title="Clubs" onSelect={() => setCurrentTab('Clubs')}>
        <Row>
          <Col style={{ display: 'flex' }}>
            <DropdownButton id={COMPONENT_IDS.ADMIN_MANAGE_CLUB_SORT} title={`Sort by: ${clubCategory}`}>
              <Dropdown.Item onClick={() => { setSortingClubsBy('clubName'); setClubCategory('Club Name'); }}>Club Name</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col xs={4} style={{ justifyContent: 'end' }}>
            <InputGroup id={COMPONENT_IDS.ADMIN_MANAGE_CLUB_SEARCH} className="mb-3">
              <Form.Control aria-label="Name" placeholder="Search for club" onChange={(e) => { setSearchClubs(e.target.value); setFilteredClubs(true); }} value={searchClubs} />
              <Button onClick={() => { setFilteredClubs(false); setSearchClubs(''); }}>Clear</Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="px-m3 py-2" style={{ padding: 15 }}>
          <Col><u>CLUB NAME</u></Col>
          <Col><u>ADVISOR</u></Col>
          <Col xs={2} />
        </Row>
        <div>
          { clubsList.map((club, index) => <ClubTable key={club._id} eventKey={`${index}`} club={club} faculty={facultyInfo} />) }
        </div>
        <Col className="d-flex justify-content-end">
          <div className="text-right" style={{ paddingRight: 16, paddingTop: 10 }}>
            <Button variant="success" onClick={() => setShowAddClub(true)}>
              + Add Club
            </Button>
          </div>
        </Col>
      </Tab>
    );
  }

  return (ready ? (
    <Container id={PAGE_IDS.ADMIN_MANAGE} className="py-3 elevated-container">
      <Row className="d-flex">
        <Col style={{ width: '100%' }}>
          { (currUser !== '' && user?.position === 'office') ? (
            <Tabs
              defaultActiveKey="profiles"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              {showProfileTab()}
            </Tabs>
          ) : ''}
          { (currUser !== '' && user?.position === 'tech') ? (
            <Tabs
              defaultActiveKey="rooms"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              {showRoomTab()}
            </Tabs>
          ) : ''}
          { currUser !== '' && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
            <Tabs
              defaultActiveKey="profiles"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              {showProfileTab()}
              {showFacultyTab()}
              {showRoomTab()}
              {showClubTab()}
            </Tabs>
          ) : ''}
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
      <AddUserModal setShowAddUser={setShowAddUser} showAddUser={showAddUser} />
      <AddFacultyModal setShowAddFaculty={setShowAddFaculty} showAddFaculty={showAddFaculty} rooms={rooms} />
      <AddRoomModal setShowAddRoom={setShowAddRoom} showAddRoom={showAddRoom} />
      <AddClubModal setShowAddClub={setShowAddClub} showAddClub={showAddClub} faculty={facultyList} />
      <ImportCSV setShowImportCSV={setShowImportCSV} showImportCSV={showImportCSV} />
    </Container>
  ) : <LoadingSpinner />);
};

export default AdminManage;
