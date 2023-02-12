import React, { useState } from 'react';
import { Modal, Button, Table, Collapse, Col } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import LoadingSpinner from './LoadingSpinner';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const RoomInfoModalSvg = ({ room, display, setDisplay }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseSvg = () => setDisplay;
  const [showMore, setShowMore] = useState(false);
  const { ready, resources } = useTracker(() => {
    const subscription = RoomResources.subscribeRoomResource();
    const rdy = subscription.ready();
    const roomResource = RoomResources.findOne({ roomNumber: room.roomNumber });
    return {
      resources: roomResource,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Col className="col-2 pb-4">
      <Button variant="light" className="border border-dark sharp me-3" onClick={handleShow}>
        Room #{resources.roomNumber} Info
      </Button>
      <Modal show={display} onHide={setDisplay}>
        <Modal.Header closeButton>
          <Modal.Title>Room #{resources.roomNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th scope="row">Room type</th>
                <td>Conference</td>
              </tr>
              <tr>
                <th scope="row">Capacity</th>
                <td>{resources.capacity}</td>
              </tr>
              <tr>
                <th scope="row" className="align-top">Resources</th>
                <td>
                  <tr className="d-flex">
                    <th scope="row" className="pe-3">Chairs</th>
                    <td className="ps-5">{resources.chairs}</td>
                  </tr>
                  <Collapse in={showMore}>
                    <div>
                      <tr>
                        <th scope="row">Desks</th>
                        <td className="ps-1">{resources.desks}</td>
                      </tr>
                      <tr>
                        <th scope="row">TV</th>
                        <td className="ps-1">{resources.tv}</td>
                      </tr>
                      <tr>
                        <th scope="row">Phone number</th>
                        <td className="ps-1">{resources.phoneNumber}</td>
                      </tr>
                      <tr>
                        <th scope="row">Data jacks</th>
                        <td className="ps-1">{resources.dataJacks}</td>
                      </tr>
                    </div>
                  </Collapse>
                  <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    aria-controls="example-collapse-text"
                    aria-expanded={showMore}
                    className="btn btn-link"
                  >
                    {showMore ? 'Show less' : 'Show more'}
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">
                  <a href="/list">Reserve</a>
                </th>
              </tr>
            </thead>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={setDisplay}>
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
  display: PropTypes.bool,
  setDisplay: PropTypes.func,
};

export default RoomInfoModal;
