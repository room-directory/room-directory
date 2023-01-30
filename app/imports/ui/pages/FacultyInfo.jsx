import React from 'react';
import { Col, Container, Row, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import Faculty from '../components/Faculty';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/* TODO: L57 Change "Loading Stuff" to "Loading Faculty Information" */
/* TODO: Make sort button into component */
/* TODO: Pull profile data from faculty info collection */

/* Shows faculty information to all users */
const FacultyInfo = () => {
  const ready = true;
  const facultyProfiles = [
    {
      firstName: 'Carleton', lastName: 'Moore', role: 'Associate Professor', picture: '/images/cam-moore.jpg', office: 'POST 307B', phone: '808-956-6920', email: 'cmoore@hawaii.edu',
    },
    {
      firstName: 'Todd', lastName: 'Tomita', role: 'IT System Admin.', picture: '/images/ICSLogo.jpg', office: 'POST 327', phone: '808-956-7639', email: 'toddtt@hawaii.edu',
    },
    {
      firstName: 'Charles', lastName: 'Shackford', role: 'IT Network/System Admin.', picture: '/images/ICSLogo.jpg', office: 'POST 327', phone: '808-956-4989', email: 'shackfor@hawaii.edu',
    },
  ];
  return (ready ? (
    <Container id={PAGE_IDS.FACULTY_INFORMATION} className="py-3">
      <Row className="justify-content-center">
        <Col md={8}>
          <Col className="text-center">
            <h2>Faculty Information</h2>
          </Col>
          <Col style={{ display: 'flex' }}>
            <DropdownButton id={COMPONENT_IDS.FACULTY_INFORMATION_SORT} title="Sort by">
              <Dropdown.Item href="#/action-1">First Name</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Last Name</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Role</Dropdown.Item>
              <Dropdown.Item href="#/action-4">Office</Dropdown.Item>
              <Dropdown.Item href="#/action-5">Phone</Dropdown.Item>
              <Dropdown.Item href="#/action-6">Email</Dropdown.Item>
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
              {facultyProfiles.map((profile) => <Faculty key={profile._id} faculty={profile} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Stuff" />);
};

export default FacultyInfo;
