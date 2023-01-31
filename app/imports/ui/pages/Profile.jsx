import React, { useState } from 'react';
import { Col, Container, Image, Row, Button, Modal } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileReservationsModalItem from '../components/ProfileReservationsModalItem';
import { Reservations } from '../../api/reservation/ReservationCollection';

/* TODO: Replace the static image link and profile information with database info */
const Profile = () => {
  const [modal, setModal] = useState(false);
  const handleModal = () => setModal(!modal);

  const { ready, reservations } = useTracker(() => {
    // Get access to Reservations documents.
    const subscription = Reservations.subscribeReservation();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Reservations documents
    const reservationItems = Reservations.find().fetch();
    return {
      reservations: reservationItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3">
      <Col className="align-content-center text-center py-5">
        <Row className="justify-content-center pb-4">
          <Image id="profile-image" roundedCircle className="h-25 w-25" src="https://archive.org/services/img/twitter-default-pfp" />
        </Row>
        <Row>
          <h2 id="profile-name">JOHN DOE</h2>
        </Row>
        <Row>
          <h4 id="profile-role">STUDENT</h4>
        </Row>
        <Row>
          <Col>
            <Button id="profile-reservations" variant="light" onClick={handleModal}><h4>YOUR RESERVATIONS</h4></Button>
          </Col>
        </Row>
      </Col>

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
