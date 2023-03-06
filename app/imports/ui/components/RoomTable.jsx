import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const RoomTable = ({ room, eventKey }) => {
  const [show, setShow] = useState(false);
  const del = () => {
    const collectionName = Room.getCollectionName();
    const instance = room._id;
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      dangerMode: true,
      buttons: true,
    }).then((result) => {
      if (result) {
        removeItMethod.callPromise({ collectionName, instance })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal('Room has been removed from ICS!', {
            icon: 'success',
          }));
      } else {
        swal('Room is safe!');
      }
    });
  };

  const typeList = ['conference', 'lecture', 'study room', 'office'];

  const submit = () => {
    const newType = document.getElementById(COMPONENT_IDS.EDIT_ROOM_TYPE_ADMIN).value;
    const newIsICS = document.getElementById(COMPONENT_IDS.EDIT_ROOM_ISICS_ADMIN).value;
    let newSquareFt = document.getElementById(COMPONENT_IDS.EDIT_ROOM_SQFT_ADMIN).value;
    newSquareFt = parseInt(newSquareFt, 10);

    const updateData = { id: room._id, roomNumber: room.roomNumber, building: room.building, type: newType, isICS: newIsICS, squareFt: newSquareFt };
    const collectionName = Room.getCollectionName();

    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Room updated successfully', 'success'));
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{room.building}</Col>
          <Col>{`${room.roomNumber}`}</Col>
          <Col>{room.type}</Col>
          <Col>{room.isICS}</Col>
          <Col>{room.squareFt}</Col>
          <Col xs={2}>
            <Row>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => setShow(true)}>Edit</Button></Col>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="danger" onClick={del}>Delete</Button></Col>
            </Row>
          </Col>
        </Row>
      </Card.Header>
      {
        show ? (
          <Modal show={show} onHide={() => setShow(false)} centered dialogClassName="modal-90w">
            <Modal.Header closeButton />
            <Modal.Body>
              <h4>Edit Room</h4>
              <Form>
                <Row style={{ paddingBottom: 20 }}>
                  <Row>
                    <Form.Group>
                      Building *
                      <Form.Control id={COMPONENT_IDS.EDIT_BUILDING_ADMIN} defaultValue={room.building ? room.building : ''} disabled />
                    </Form.Group>
                  </Row>
                  <Row>

                    <Form.Group>
                      Room Number *
                      <Form.Control id={COMPONENT_IDS.EDIT_ROOM_NUMBER_ADMIN} defaultValue={room.roomNumber ? room.roomNumber : ''} disabled />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      Room Type *
                      <Form.Select id={COMPONENT_IDS.EDIT_ROOM_TYPE_ADMIN} placeholder="Select a type" options={typeList} style={{ marginBottom: 5 }} defaultValue={room.type ? room.type : ''}>
                        <option disabled>Select</option>
                        {typeList.map((name, index) => (
                          <option value={name} key={index}>{name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      Is ICS? *
                      <Form.Select id={COMPONENT_IDS.EDIT_ROOM_ISICS_ADMIN} defaultValue={room.isICS}>
                        <option>Yes</option>
                        <option>No</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group>
                      Square Ft *
                      <Form.Control id={COMPONENT_IDS.EDIT_ROOM_SQFT_ADMIN} type="number" defaultValue={room.squareFt ? room.squareFt : ''} />
                    </Form.Group>
                  </Row>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 25 }}>
                  <Button variant="primary" type="submit" alt="Submit Changes" onClick={submit}>
                    Submit Changes
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        ) : ''
      }
    </Card>
  );
};

/* Referencing the Room Collection */
RoomTable.propTypes = {
  room: PropTypes.shape({
    _id: PropTypes.string,
    roomNumber: PropTypes.string,
    building: PropTypes.string,
    type: PropTypes.string,
    isICS: PropTypes.string,
    squareFt: PropTypes.number,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default RoomTable;
