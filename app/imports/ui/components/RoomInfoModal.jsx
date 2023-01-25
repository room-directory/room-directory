import React, { useState } from 'react';
import { Modal, Button, Table, Collapse } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const RoomInfoModal = () => {
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button className="btn btn-primary" onClick={handleShow}>
        Room Info
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Room 319</Modal.Title>
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
                  <Button
                    onClick={() => setShowMore(!showMore)}
                    aria-controls="example-collapse-text"
                    aria-expanded={showMore}
                    className="btn btn-primary"
                  >
                    {showMore ? 'Show less' : 'Show more'}
                  </Button>
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
    </>
  );
};
export default RoomInfoModal;
