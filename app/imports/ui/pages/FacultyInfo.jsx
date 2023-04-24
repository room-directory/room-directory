import React, { useState } from 'react';
import { Col, Container, Row, Table, DropdownButton, Dropdown, Form, InputGroup, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Faculty from '../components/Faculty';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const FacultyInfo = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, ready, profiles } = useTracker(() => {
    // Get access to current user
    const currUser = Meteor.user() ? Meteor.user().username : '';
    // Get access to faculty profiles documents.
    const subscription = FacultyProfiles.subscribeFacultyProfile();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the faculty profiles documents
    const facultyProfileItems = FacultyProfiles.find({}).fetch();
    return {
      currentUser: currUser,
      profiles: facultyProfileItems,
      ready: rdy,
    };
  }, []);
  let profilesList = profiles;
  // create sorting method
  const [sortingBy, setSortingBy] = useState('lastName');
  const [category, setCategory] = useState('Last Name');
  const [filtered, setFiltered] = useState(false);
  const [search, setSearch] = useState('');
  if (filtered && currentUser !== '') {
    profilesList = profiles.filter((profile) => `${profile.firstName} ${profile.lastName} ${profile.role} ${profile.email} ${profile.phone} ${profile.officeLocation} ${profile.officeHours}`.toLowerCase().includes(search.toLowerCase()));
  } else if (filtered) {
    profilesList = profiles.filter((profile) => `${profile.firstName} ${profile.lastName} ${profile.role} ${profile.email} ${profile.phone} ${profile.officeLocation}`.toLowerCase().includes(search.toLowerCase()));
  } else {
    profilesList = profiles;
  }
  profilesList.sort(function (a, b) {
    if (a[sortingBy] === b[sortingBy] || (Array.isArray(a[sortingBy]) && Array.isArray(b[sortingBy]) && a[sortingBy][0] === b[sortingBy][0])) {
      return a.lastName.localeCompare(b.lastName);
    }
    if (['Not Available', 'No Email Contact', 'No Phone Contact', 'Unknown'].includes(a[sortingBy]) || a[sortingBy][0] === 'Not Available' || a[sortingBy].length === 0) {
      return 1;
    }
    if (['Not Available', 'No Email Contact', 'No Phone Contact', 'Unknown'].includes(b[sortingBy]) || b[sortingBy][0] === 'Not Available' || b[sortingBy].length === 0) {
      return -1;
    }
    if (['phone', 'officeLocation', 'role'].includes(sortingBy)) {
      return a[sortingBy][0].localeCompare(b[sortingBy][0]);
    }
    return a[sortingBy].localeCompare(b[sortingBy]);
  });
  return (ready ? (
    <Container id={PAGE_IDS.FACULTY_INFORMATION} className="py-3">
      <Row className="justify-content-center">
        <Col md={9}>
          <Col className="text-center">
            <h2>Faculty Information</h2>
          </Col>
          <Row>
            <Col style={{ display: 'flex' }}>
              <DropdownButton id={COMPONENT_IDS.FACULTY_INFORMATION_SORT} title={`Sort by: ${category}`}>
                <Dropdown.Item onClick={() => { setSortingBy('firstName'); setCategory('First Name'); }}>First Name</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortingBy('lastName'); setCategory('Last Name'); }}>Last Name</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortingBy('role'); setCategory('Role'); }}>Title</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortingBy('phone'); setCategory('Phone'); }}>Phone</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortingBy('email'); setCategory('Email'); }}>Email</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortingBy('officeLocation'); setCategory('Office Location'); }}>Office Location</Dropdown.Item>
                { currentUser !== '' ?
                  ([
                    <Dropdown.Item onClick={() => { setSortingBy('officeHours'); setCategory('Office Hours'); }}>Office Hours</Dropdown.Item>,
                  ])
                  : ''}
              </DropdownButton>
            </Col>
            <Col xs={4} style={{ justifyContent: 'end' }}>
              <InputGroup id={COMPONENT_IDS.FACULTY_INFORMATION_SEARCH} className="mb-3">
                <Form.Control aria-label="Name" placeholder="Search for faculty" onChange={(e) => { setSearch(e.target.value); setFiltered(true); }} value={search} />
                <Button onClick={() => { setFiltered(false); setSearch(''); }}>Clear</Button>
              </InputGroup>
            </Col>
          </Row>

          <Table hover>
            <thead>
              <tr>
                <th> </th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Office Location</th>
                { currentUser !== '' ?
                  ([
                    <th>Office Hours</th>,
                  ])
                  : ''}
              </tr>
            </thead>
            <tbody>
              {profilesList.map((faculty) => <Faculty key={faculty._id} faculty={faculty} user={currentUser} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Faculty Information" />);
};

export default FacultyInfo;
