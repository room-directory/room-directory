import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
// import { UserProfiles } from '../../api/user/UserProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const AddRoomModal = ({ showAddRoom, setShowAddRoom }) => {
  const typeList = ['conference', 'lecture', 'study room', 'office'];
  const submitAddRoom = () => {
    const roomData = { roomNumber, roomType, roomCapacity };
    const collectionName = Room.getCollectionName();

    defineMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Room added successfully', 'success'));
  };

  return (
    <Modal show={showAddRoom} onHide={() => setShowAddRoom(false)} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Room Information</h4>
        <Form>
          <Row style={{ paddingBottom: 20 }}>
            <Row>

              <Form.Group>
                Room Number *
                <Form.Control id={COMPONENT_IDS.ADD_ROOM_NUMBER_ADMIN} />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                Room Type *
                <Form.Select id={COMPONENT_IDS.ADD_ROOM_TYPE_ADMIN} placeholder="Select a type" options={typeList} style={{ marginBottom: 5 }}>
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
                <Form.Control id={COMPONENT_IDS.ADD_ROOM_CAPACITY_ADMIN} />
              </Form.Group>
            </Row>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 25 }}>
            <Button variant="primary" type="submit" alt="Submit Room" onClick={submitAddRoom}>
              Submit Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

/* Referencing the Room Collection */
AddRoomModal.propTypes = {
  showAddRoom: PropTypes.bool.isRequired,
  setShowAddRoom: PropTypes.func.isRequired,
};

export default AddRoomModal;
