import React, { useState } from 'react';
import { Col, Container, Image, Row, Button, Modal } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';
import { useParams } from 'react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileReservationsModalItem from '../components/ProfileReservationsModalItem';
import { Reservations } from '../../api/reservation/ReservationCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';

/* TODO: Implement Edit profile, review user profile subscription (currently getting all profiles) */
const Profile = () => {
  const [modal, setModal] = useState(false);
  const handleModal = () => setModal(!modal);

  const { _id } = useParams();

  const { ready, reservations, user, thisUser } = useTracker(() => {
    // Get access to Reservations and User Profile documents.
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const adminProfileSubscription = AdminProfiles.subscribe();
    const reservationSubscription = Reservations.subscribeReservation();
    const profileSubscription = UserProfiles.subscribe();
    // Determine if the subscriptions are ready
    const rdy1 = reservationSubscription.ready();
    const rdy2 = profileSubscription.ready();
    const rdy3 = adminProfileSubscription.ready();
    const rdy = rdy1 && rdy2 && rdy3;
    // Get the Reservations and User Profile documents
    const reservationItems = Reservations.find().fetch();
    const thisUsr = UserProfiles.findOne({ email: currUser }, {});
    let usr = UserProfiles.findOne({ _id: _id }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ _id: _id }, {});

    console.log('should print out one user');
    console.log(usr);

    return {
      reservations: reservationItems,
      user: usr,
      thisUser: thisUsr,
      ready: rdy,
    };
  }, [_id]);

  return (ready ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3">
      <Row className="justify-content-center pb-4">
        <Col sm={3}>
          <Row className="p-3">
            <Image id="profile-image" roundedCircle src={user.image} />
          </Row>
          <Row>
            { Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) || thisUser._id === _id ? (
              <Button id="profile-reservations" href={`/edit-profile/${_id}`} variant="outline-secondary">Edit Profile</Button>
            ) : '' }
          </Row>
        </Col>
        <Col sm={1} />
        <Col sm={6} className="p-3">
          <Row>
            <h2 id="profile-name" style={{ textTransform: 'uppercase' }}>{`${user.firstName} ${user.lastName}`}</h2>
          </Row>
          <Row>
            {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
              <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>ADMIN</h4>
            ) :
              <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>{`${user.position}`}</h4> }
          </Row>
          <Row>
            <Col>
              <Button id="profile-reservations" variant="link" onClick={handleModal}><h4>YOUR RESERVATIONS</h4></Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal show={modal} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Your Reservations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {reservations.map((reservation) => <ProfileReservationsModalItem key={reservation._id} reservation={reservation} />)}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  ) : <LoadingSpinner message="Loading Profile" />);
};

export default Profile;
