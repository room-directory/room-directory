import React, { useState } from 'react';
import { Modal, Button, Table, Collapse, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const RoomInfoModal = ({ room }) => {
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Col className="col-2 pb-4">
      <Button variant="light" className="border border-dark sharp me-3" onClick={handleShow}>
        Room #{room.roomNumber} Info
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Room #{room.roomNumber}</Modal.Title>
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
                <td>20</td>
              </tr>
              <tr>
                <th scope="row" className="align-top">Resources</th>
                <td>
                  <tr className="d-flex">
                    <th scope="row" className="pe-3">Chairs</th>
                    <td className="ps-5">23</td>
                  </tr>
                  <Collapse in={showMore}>
                    <div>
                      <tr>
                        <th scope="row">Desks</th>
                        <td className="ps-1">8</td>
                      </tr>
                      <tr>
                        <th scope="row">TV</th>
                        <td className="ps-1">6</td>
                      </tr>
                      <tr>
                        <th scope="row">Phone number</th>
                        <td className="ps-1">(202)132-2131</td>
                      </tr>
                      <tr>
                        <th scope="row">Data jacks</th>
                        <td className="ps-1">8</td>
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
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
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
