import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Modal, Button, Table, Collapse, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import LoadingSpinner from './LoadingSpinner';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import RoomInfoModalDetails from './RoomInfoModalDetails';

/** The RoomInfoModalSVG appears at the bottom of the Room List page. */
const RoomInfoModal = ({ room }) => {
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const currUser = Meteor.user() ? Meteor.user().username : '';
  const { currentUser, user, ready, resources } = useTracker(() => {
    const subscription = RoomResources.subscribeRoomResource();
    const rdy = subscription.ready();
    const roomResource = RoomResources.findOne({ roomNumber: room.roomNumber });
    let usr = UserProfiles.findOne({ email: currUser }, {});
    if (usr === undefined) (usr = AdminProfiles.findOne({ email: currUser }, {}));
    return {
      currentUser: currUser,
      resources: roomResource,
      user: usr,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Col className="col-2 pb-4">
      <Button variant="light" className="border border-dark sharp me-3" onClick={handleShow}>
        Room #{resources.roomNumber} Info
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Room #{resources.roomNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
            <thead>
              <tr>
                <th scope="row">Room type</th>
                <td>Conference</td>
              </tr>
              { currentUser !== '' && (user?.position === 'office' || Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN])) ?
                ([
                  <tr>
                    <th scope="row">Capacity</th>
                    <td>{resources.capacity}</td>
                  </tr>,
                  <tr>
                    <th scope="row" className="align-top">Resources</th>
                    <td>
                      <tr>
                        <th scope="row">Chairs: </th>
                        <td className="ps-3">{resources.chairs}</td>
                      </tr>
                      <tr>
                        <th scope="row">TV: </th>
                        <td className="ps-3">{resources.tv.length}</td>
                      </tr>
                      <Collapse in={showMore}>
                        <div>
                          {resources.tv.map((tv) => <RoomInfoModalDetails key={tv.number} details={tv} />)}
                        </div>
                      </Collapse>
                      <tr>
                        <th scope="row">Phone number: </th>
                        <td className="ps-3">{resources.phoneNumber}</td>
                      </tr>
                      <tr>
                        <th scope="row">Data jacks: </th>
                        <td className="ps-3">{resources.dataJacks.length}</td>
                      </tr>
                      <Collapse in={showMore}>
                        <div>
                          {resources.dataJacks.map((dataJacks) => <RoomInfoModalDetails key={dataJacks.number} details={dataJacks} />)}
                        </div>
                      </Collapse>
                      <button
                        type="button"
                        onClick={() => setShowMore(!showMore)}
                        aria-controls="example-collapse-text"
                        aria-expanded={showMore}
                        className="btn btn-link"
                      >
                        {showMore ? 'Show less' : 'Show More'}
                      </button>
                    </td>
                  </tr>,
                  // <tr>
                  //   <th scope="row">
                  //     <a href="/list">Reserve</a>
                  //   </th>
                  // </tr>,
                ]) : ''}
            </thead>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  ) :
    <LoadingSpinner />
  );
};
RoomInfoModal.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default RoomInfoModal;
