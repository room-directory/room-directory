import React, { useState } from 'react';
import { Col, Container, Image, Row, Button, Modal, Card } from 'react-bootstrap';
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
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import { ROLE } from '../../api/role/Role';

/* function to convert date */
function dateToTime(date) {
  const cDay = date.getDate();
  const cMonth = date.getMonth() + 1;
  const cYear = date.getFullYear();
  const cHour = date.getUTCHours();
  let cMin = date.getUTCMinutes();
  if (cMin < 10) { cMin = `0${cMin}`; }
  const ampm = cHour >= 12 ? 'pm' : 'am';

  return `${cMonth}/${cDay}/${cYear} ${cHour % 12}:${cMin} ${ampm}`;
}

const Profile = () => {
  const [modal, setModal] = useState(false);
  const handleModal = () => setModal(!modal);

  const { _id } = useParams();

  const { ready, reservations, facultyInfo, user, thisUser } = useTracker(() => {
    // Get access to Reservations and User Profile documents.
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const adminProfileSubscription = AdminProfiles.subscribe();
    const reservationSubscription = Reservations.subscribeReservation();
    const profileSubscription = UserProfiles.subscribe();
    const facultySubscription = FacultyProfiles.subscribeFacultyProfile();
    // Determine if the subscriptions are ready
    const rdy1 = reservationSubscription.ready();
    const rdy2 = profileSubscription.ready();
    const rdy3 = adminProfileSubscription.ready();
    const rdy4 = facultySubscription.ready();
    const rdy = rdy1 && rdy2 && rdy3 && rdy4;
    // Get the Reservations and User Profile documents
    const reservationItems = Reservations.find().fetch();
    const facultyItems = FacultyProfiles.find({}).fetch();
    const thisUsr = UserProfiles.findOne({ email: currUser }, {});
    let usr = UserProfiles.findOne({ _id: _id }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ _id: _id }, {});
    // console.log('should print out one user');
    // console.log(usr);
    return {
      facultyInfo: facultyItems,
      reservations: reservationItems,
      user: usr,
      thisUser: thisUsr,
      ready: rdy,
    };
  }, [_id]);

  let filteredFaculty;
  if (ready) {
    filteredFaculty = facultyInfo.filter(faculty => faculty.email === user.email)[0];
  }

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
          <div className="d-flex align-items-baseline justify-content-start">
            <h2 id="profile-name" style={{ textTransform: 'uppercase' }} className="pe-3">{`${user.firstName} ${user.lastName}`}</h2>
            {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
              <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>(ADMIN)</h4>
            ) :
              <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>({`${user.position}`})</h4> }
          </div>
          <Row className="pt-3" sm={1} md={2}>
            <Col sm="7">
              <Card style={{ width: '16rem' }}>
                <Card.Header>Your Room Reservations</Card.Header>
                <Card.Body>
                  {reservations.length > 0 ? (
                    <Card.Text>
                      Name: {reservations[0].firstName} {reservations[0].lastName} <br />
                      Room: #{reservations[0].roomNumber} <br />
                      Start: {dateToTime(reservations[0].startTime)}<br />
                      End: {dateToTime(reservations[0].endTime)}
                    </Card.Text>
                  ) : (
                    <Card.Text>
                      You currently have no reservations.
                    </Card.Text>
                  )}
                  <Button variant="outline-secondary" onClick={handleModal}>View all reservations</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="7">
              <Card style={{ width: '16rem' }}>
                <Card.Header>Your Room Assignments</Card.Header>
                <Card.Body>
                  {(user.position === 'faculty' && filteredFaculty) ? (
                    <Card.Text>
                      {filteredFaculty.officeLocation.map((office) => <div>{office}</div>)}
                    </Card.Text>
                  ) : (
                    <Card.Text>
                      You currently have no room assignments.
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal show={modal} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Your Room Reservations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {reservations.map((reservation) => <ProfileReservationsModalItem key={reservation._id} reservation={reservation} dateToTime={dateToTime} />)}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  ) : <LoadingSpinner message="Loading Profile" />);
};

export default Profile;
