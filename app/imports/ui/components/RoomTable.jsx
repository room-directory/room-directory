import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, SelectField, TextField, NumField } from 'uniforms-bootstrap5';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';

const bridge = new SimpleSchema2Bridge(Room._schema);

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

  const submit = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { building, roomNumber, type, isICS, squareFt, occupants } = data;
    const occupantArray = (occupants.includes(',') ? occupants.replace(/\s+/g, '').split(',') : occupants);
    const updateData = { id: room._id, roomNumber: room.roomNumber, building: room.building, type, isICS, squareFt, occupants: occupantArray };
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
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={room}>

                <Row>
                  <Col>
                    <TextField name="building" placeholder="Building" disabled />
                  </Col>
                  <Col>
                    <TextField name="roomNumber" placeholder="Room Number" disabled />
                  </Col>
                </Row>
                <Row>
                  <SelectField name="type" allowedValues={typeList} placeholder="Room Type" />
                </Row>
                <Row>
                  <SelectField name="isICS" allowedValues={['Yes', 'No']} placeholder="ICS Room" />
                </Row>
                <Row>
                  <NumField name="squareFt" icon="user" decimal={false} />
                </Row>
                <Row>
                  <TextField name="occupants" placeholder="Occupants" help="Please separate occupants by using commas." />
                </Row>
                <SubmitField value="Submit" />
                <ErrorsField />
              </AutoForm>
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
