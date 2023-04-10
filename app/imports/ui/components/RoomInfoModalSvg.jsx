import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Modal, Button, Table, Col, Card, Row, Accordion } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { PeopleFill } from 'react-bootstrap-icons';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import LoadingSpinner from './LoadingSpinner';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import RoomInfoModalDetails from './RoomInfoModalDetails';

/* TODO: implement into RoomInfoModal.jsx file */
/** The RoomInfoModalSVG appears when clicking on a room in the Room List page. */
const RoomInfoModalSvg = ({ room, display, setDisplay }) => {
  // const [showMore, setShowMore] = useState(false);
  const currUser = Meteor.user() ? Meteor.user().username : '';
  const { currentUser, ready, user, resources, faculty } = useTracker(() => {
    const resourceSubscription = RoomResources.subscribeRoomResource();
    const facultySubscription = RoomResources.subscribeRoomResource();
    const rdy = resourceSubscription.ready() && facultySubscription.ready();
    let roomResource = room;
    const facultyList = room.occupants.map(occupant => FacultyProfiles.findOne({ email: occupant }));
    if (room !== undefined) {
      roomResource = RoomResources.findOne({ roomNumber: room.roomNumber });
    } else {
      roomResource = undefined;
    }
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
    <Col className="col-2 pb-4" style={{ display: 'flex', justifyContent: 'center' }}>
      {resources === undefined ? (
        <Modal show={display} onHide={setDisplay} backdrop="static" dialogClassName="modal-90w" centered>
          <Modal.Header closeButton>
            <Modal.Title>No information for this room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            No information
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={setDisplay}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={display} onHide={setDisplay} backdrop="static" dialogClassName="modal-90w" centered>
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
                  <Card style={{ height: '140px', overflowY: 'auto' }}>
                    <Card.Body>
                      <h5>Description</h5>
                      <div>
                        Type: {room.type.toUpperCase()} <br />
                        {room.squareFt} sq. ft. <br />
                        Max capacity of {resources.capacity}
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
            <Button variant="danger" onClick={setDisplay}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Col>
  ) :
    <LoadingSpinner />
  );
};
RoomInfoModalSvg.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    occupants: PropTypes.arrayOf(PropTypes.string),
    squareFt: PropTypes.number,
    notes: PropTypes.string,
    _id: PropTypes.string,
  }),
  display: PropTypes.bool.isRequired,
  setDisplay: PropTypes.func.isRequired,
};
RoomInfoModalSvg.defaultProps = {
  room: undefined,
};

export default RoomInfoModalSvg;
