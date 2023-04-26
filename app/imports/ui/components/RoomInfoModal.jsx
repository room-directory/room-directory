import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Modal, Button, Table, Card, Accordion, Row, Col } from 'react-bootstrap';
import { PeopleFill } from 'react-bootstrap-icons';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import RoomInfoModalDetails from './RoomInfoModalDetails';

/** The RoomInfoModalSVG appears at the bottom of the Room List page. */
const RoomInfoModal = ({ room, show, setShow }) => {
  const handleClose = () => setShow(false);
  const currUser = Meteor.user() ? Meteor.user().username : '';
  const { currentUser, user, ready, resources, faculty } = useTracker(() => {
    const resourceSubscription = RoomResources.subscribeRoomResource();
    const facultySubscription = FacultyProfiles.subscribeFacultyProfile();
    const rdy = resourceSubscription.ready() && facultySubscription.ready();
    const roomResource = RoomResources.findOne({ roomNumber: room.roomNumber });
    const facultyList = room.occupants.map(occupant => FacultyProfiles.findOne({ email: occupant }));
    let usr = UserProfiles.findOne({ email: currUser }, {});
    if (usr === undefined) (usr = AdminProfiles.findOne({ email: currUser }, {}));
    return {
      currentUser: currUser,
      resources: roomResource,
      faculty: facultyList,
      user: usr,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Modal show={show} onHide={handleClose} backdrop="static" dialogClassName="modal-90w" centered>
      <Modal.Header closeButton>
        <Modal.Title>Room #{resources.roomNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Card>
            <Card.Body>
              <div className="ps-1">
                <PeopleFill />   {faculty.length > 0 ? faculty.map((person, index) => `${person.firstName} ${person.lastName}${index < faculty.length - 1 ? ', ' : ''}`) : 'Empty.'}
              </div>
            </Card.Body>
          </Card>
          <Row className="py-3">
            <Col>
              <Card style={{ height: '185px', overflowY: 'auto' }}>
                <Card.Body>
                  <h5>Description</h5>
                  <div>
                    <Table borderless>
                      <tbody>
                        <tr style={{ height: 'auto', fontSize: '12px' }}>
                          <td style={{ width: '65%' }}>Type:</td>
                          <td style={{ width: '35%' }}>{room.type.toUpperCase()}</td>
                        </tr>
                        <tr style={{ height: 'auto', fontSize: '12px' }}>
                          <td style={{ width: '65%' }}>Room Size:</td>
                          <td style={{ width: '35%' }}>{room.squareFt} sq.ft.</td>
                        </tr>
                        <tr style={{ height: 'auto', fontSize: '12px' }}>
                          <td style={{ width: '65%' }}>Max Capacity:</td>
                          <td style={{ width: '35%' }}>{resources.capacity}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ height: '134px', overflowY: 'auto' }}>
                <Card.Body>
                  <h5>Notes</h5>
                  <div className="pb-3">
                    {room.notes ? room.notes : 'No Notes.'}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
        { currentUser !== '' && (user?.position === 'office' || user?.position === 'tech' || Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN])) ? (
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header><h5>Resources</h5></Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col>
                    <div className="pb-1"><strong>Chairs:</strong> {resources.chairs}</div>
                  </Col>
                  <Col>
                    <div className="pb-1"><strong>Phone Number:</strong> {resources.phoneNumber}</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="pb-1"><strong>TV:</strong> {resources.tv.length}</div>
                    <Table bordered>
                      <thead>
                        <tr>
                          <td>Number</td>
                          <td>Location</td>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.tv.map((tv) => <RoomInfoModalDetails key={tv.number} details={tv} />)}
                      </tbody>
                    </Table>
                  </Col>
                  <Col>
                    <div className="pb-1"><strong>Data jacks:</strong> {resources.dataJacks.length}</div>
                    <Table bordered>
                      <thead>
                        <tr>
                          <td>Number</td>
                          <td>Location</td>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.dataJacks.map((dataJacks) => <RoomInfoModalDetails key={dataJacks.number} details={dataJacks} />)}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ) : '' }
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  ) :
    ''
  );
};
RoomInfoModal.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    occupants: PropTypes.arrayOf(PropTypes.string),
    squareFt: PropTypes.number,
    notes: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default RoomInfoModal;
