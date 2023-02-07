import React, { useState } from 'react';
import { Col, Container, Image, Row, Button } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';

/* TODO: Implement Edit profile, review user profile subscription (currently getting all profiles) */
const EditProfile = () => {
  const [newID, setNewID] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const { _id } = useParams();

  const { ready, user } = useTracker(() => {
    // Get access to Reservations and User Profile documents.
    const profileSubscription = UserProfiles.subscribe();
    const adminProfileSubscription = AdminProfiles.subscribe();
    // Determine if the subscriptions are ready
    const rdy1 = adminProfileSubscription.ready();
    const rdy2 = profileSubscription.ready();
    const rdy = rdy1 && rdy2;
    // Get the Reservations and User Profile documents
    let usr = UserProfiles.findOne({ _id: _id }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ _id: _id }, {});
    return {
      user: usr,
      ready: rdy,
    };
  }, [_id]);

  const submit = () => {
    console.log('Working');
  };

  return (ready ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3">
      <Row>
        <Col>
          <h1 className="montserrat" style={{ textAlign: 'left', fontSize: '2em' }}>Edit Profile</h1>
        </Col>
      </Row>
      <Col className="align-content-center text-center py-5">
        <Row className="justify-content-center pb-4">
          <Image id="profile-image" roundedCircle className="h-25 w-25" src="https://archive.org/services/img/twitter-default-pfp" />
        </Row>
        <Row>
          <h2 id="profile-name" style={{ textTransform: 'uppercase' }}>{`${user.firstName} ${user.lastName}`}</h2>
        </Row>
        <Row>
          {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
            <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>ADMIN</h4>
          ) :
            <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>{`${user.position}`}</h4> }
        </Row>
        <Row />
        {/* <Row> */}
        {/*  <Col> */}
        {/*    <Button id="profile-reservations" variant="link" onClick={handleModal}><h4>YOUR RESERVATIONS</h4></Button> */}
        {/*  </Col> */}
        {/* </Row> */}
        <Row>
          <Col style={{ textAlign: 'right' }}>
            <Button variant="success" onClick={submit}>Save</Button>
          </Col>
        </Row>
      </Col>

      {/* <Modal show={modal} onHide={handleModal}> */}
      {/*  <Modal.Header closeButton> */}
      {/*    <Modal.Title>Your Reservations</Modal.Title> */}
      {/*  </Modal.Header> */}
      {/*  <Modal.Body> */}
      {/*    <Row> */}
      {/*      {reservations.map((reservation) => <ProfileReservationsModalItem key={reservation._id} reservation={reservation} />)} */}
      {/*    </Row> */}
      {/*  </Modal.Body> */}
      {/* </Modal> */}
    </Container>
  ) : <LoadingSpinner message="Loading Profile" />);
};

export default EditProfile;
