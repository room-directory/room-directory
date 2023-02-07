import React, { useState } from 'react';
import { Col, Container, Row, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import Faculty from '../components/Faculty';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const FacultyInfo = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, profiles } = useTracker(() => {
    // Get access to faculty profiles documents.
    const subscription = FacultyProfiles.subscribeFacultyProfileAdmin();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the faculty profiles documents
    const facultyProfileItems = FacultyProfiles.find({}).fetch();
    return {
      profiles: facultyProfileItems,
      ready: rdy,
    };
  }, []);
  const [sortingBy, setSortingBy] = useState('lastName');
  profiles.sort((a, b) => a[sortingBy].localeCompare(b[sortingBy]));
  return (ready ? (
    <Container id={PAGE_IDS.FACULTY_INFORMATION} className="py-3">
      <Row className="justify-content-center">
        <Col md={8}>
          <Col className="text-center">
            <h2>Faculty Information</h2>
          </Col>
          <Col style={{ display: 'flex' }}>
            <DropdownButton id={COMPONENT_IDS.FACULTY_INFORMATION_SORT} title="Sort by">
              <Dropdown.Item onClick={() => setSortingBy('firstName')}>First Name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortingBy('lastName')}>Last Name</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortingBy('role')}>Role</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortingBy('office')}>Office</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortingBy('phone')}>Phone</Dropdown.Item>
              <Dropdown.Item onClick={() => setSortingBy('email')}>Email</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Table hover>
            <thead>
              <tr>
                <th> </th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Office</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((faculty) => <Faculty key={faculty._id} faculty={faculty} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Faculty Information" />);
};

export default FacultyInfo;
