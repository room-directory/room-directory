import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Container, Form, FormControl, Modal, Row, Table } from 'react-bootstrap';
import swal from 'sweetalert';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const RoomTable = ({ room, eventKey }) => {
  const [show, setShow] = useState(false);
  const del = () => {
    const collectionName = Room.getCollectionName();
    const instance = room.roomNumber;
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
          .then(() => swal('Room has been deleted!', {
            icon: 'success',
          }));
      } else {
        swal('Room is safe!');
      }
    });
  };

  const typeList = ['conference', 'lecture', 'study room', 'office'];

  const submit = () => {
    const newRoomNumber = document.getElementById(COMPONENT_IDS.EDIT_ROOM_NUMBER_ADMIN).value;
    const newType = document.getElementById(COMPONENT_IDS.EDIT_ROOM_TYPE_ADMIN).value;
    const newCapacity = document.getElementById(COMPONENT_IDS.EDIT_ROOM_CAPACITY_ADMIN).value;

    const updateData = { roomNumber: room.roomNumber, type: room.type, capacity: room.capacity };
    const collectionName = Room.getCollectionName();

    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Room updated successfully', 'success'));
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${room.roomNumber}`}</Col>
          <Col>{room.type}</Col>
          <Col>{room.capacity}</Col>
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
                      Room Number *
                      <Form.Control id={COMPONENT_IDS.EDIT_ROOM_NUMBER_ADMIN} defaultValue={room.roomNumber ? room.roomNumber : ''} />
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
                      Room Capacity *
                      <Form.Control id={COMPONENT_IDS.EDIT_ROOM_CAPACITY_ADMIN} defaultValue={room.capacity ? room.capacity : ''} />
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
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    capacity: PropTypes.number,
  }).isRequired,
};

export default RoomTable;
