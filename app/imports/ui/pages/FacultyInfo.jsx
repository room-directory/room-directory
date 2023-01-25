import React from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import Faculty from '../components/Faculty';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';

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
