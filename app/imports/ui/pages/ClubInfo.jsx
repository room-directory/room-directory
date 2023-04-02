import React, { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { PAGE_IDS } from '../utilities/PageIDs';
import { Club } from '../../api/club/ClubCollection';
import ClubItem from '../components/Club';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const ClubInfo = () => {
  const [filtered, setFiltered] = useState(false);
  const [search, setSearch] = useState('');

  const { ready, clubs } = useTracker(() => {
    // Get access to faculty profiles documents.
    const subscription = Club.subscribeClub();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the faculty profiles documents
    const clubItems = Club.find({}).fetch();
    return {
      clubs: clubItems,
      ready: rdy,
    };
  }, []);

  let clubsList = clubs;
  if (filtered) {
    clubsList = clubs.filter((club) => `${club.clubName}`.toLowerCase().includes(search.toLowerCase()));
  } else {
    clubsList = clubs;
  }

  return (ready ? (
    <Container id={PAGE_IDS.CLUB_INFORMATION} className="py-3">
      <Row className="justify-content-center">
        <Col md={9}>
          <Col className="text-center">
            <h2>Club Information</h2>
          </Col>
          <Row className="flex-row-reverse">
            <Col xs={4} style={{ justifyContent: 'end' }}>
              <InputGroup id={COMPONENT_IDS.CLUB_INFORMATION_SEARCH} className="mb-3">
                <Form.Control aria-label="Name" placeholder="Search for club" onChange={(e) => { setSearch(e.target.value); setFiltered(true); }} value={search} />
                <Button onClick={() => { setFiltered(false); setSearch(''); }}>Clear</Button>
              </InputGroup>
            </Col>
          </Row>
          <Row style={{ alignContent: 'center' }} className="row-cols-md-auto">
            <Col className="mb-4 listing">
              {clubsList.map((club) => <ClubItem key={club._id} club={club} />)}
            </Col>
          </Row>

          {/* <Table hidden> */}
          {/*  <thead> */}
          {/*    <tr> */}
          {/*      <th> </th> */}
          {/*      <th>Club Name</th> */}
          {/*      <th>Description</th> */}
          {/*      <th>RIO Student(s)</th> */}
          {/*      <th>Advisor(s)</th> */}
          {/*    </tr> */}
          {/*  </thead> */}
          {/*  <tbody> */}
          {/*    {clubsList.map((club) => <ClubItem key={club._id} club={club} />)} */}
          {/*  </tbody> */}
          {/* </Table> */}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Club Information" />);
};

export default ClubInfo;
