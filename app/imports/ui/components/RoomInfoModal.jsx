import React, { useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const RoomInfoModal = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showResources, setShowResources] = useState(false);
  const handleCloseResources = () => setShow(false);
  const handleShowResources = () => setShow(true);
  return (
    <>
      <Button className="btn btn-primary" onClick={handleShow}>
        Words
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Room #</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th scope="row">fdf</th>
              </tr>
              <tr>
                <th scope="row">fdf</th>
                <td className="text-center">fdslfk</td>
              </tr>
              <tr>
                <th scope="row">fdf</th>
              </tr>
              <tr>
                <th scope="row">fdf</th>
              </tr>
              <tr>
                <th scope="row">fdf</th>
              </tr>
              <tr>
                <th scope="row">
                  <Button onClick={handleShowResources}>More info</Button>
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
