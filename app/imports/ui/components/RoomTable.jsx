import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
// import { UserProfiles } from '../../api/user/UserProfileCollection';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, SelectField, TextField, NumField, ListField } from 'uniforms-bootstrap5';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { RoomResources } from '../../api/room/RoomResourceCollection';

// import TextField from 'uniforms-bootstrap5/src/TextField';

const bridge = new SimpleSchema2Bridge(Room._schema.extend(RoomResources._schema));

const RoomTable = ({ room, resources, faculty, eventKey }) => {

  const [show, setShow] = useState(false);
  const typeList = ['conference', 'lecture', 'study room', 'office'];
  const combinedModel = {
    ...room,
    ...resources,
  };

  /* const del = () => {
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
  }; */

  const submit = (data) => {
    const { building, roomNumber, type, isICS, squareFt, occupants, chairs, desks, phoneNumber, capacity } = data;
    const occupantArray = (occupants.includes(',') ? occupants.replace(/\s+/g, '').split(',') : occupants);
    let updateData = { id: room._id, roomNumber: roomNumber, building: building, type, isICS, squareFt, occupants: occupantArray };
    let collectionName = Room.getCollectionName();

    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'));

    updateData = { id: resources._id, chairs: chairs, desks: desks, phone: phoneNumber, capacity: capacity };
    collectionName = RoomResources.getCollectionName();

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
          <Col>{room.occupants.length > 0 ? room.occupants.map((people) => (
            <Row>
              <Col>
                {faculty.find(x => x.email === people).firstName} {faculty.find(x => x.email === people).lastName}
              </Col>
              <Col>
                {faculty.find(x => x.email === people).email}
              </Col>
            </Row>

          )) : 'None'}
          </Col>
          <Col>{room.isICS}</Col>
          <Col>{room.squareFt}</Col>
          <Col xs={2}>
            <Row>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => setShow(true)}>Edit</Button></Col>
            </Row>
          </Col>
        </Row>
      </Card.Header>
      {
        show ? (
          <Modal show={show} onHide={() => setShow(false)} centered dialogClassName="modal-90w" className="modal-xl">
            <Modal.Header closeButton />
            <Modal.Body>
              <h4>Edit Room</h4>
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={combinedModel}>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        <TextField name="building" placeholder="Building" disabled />
                      </Col>
                      <Col>
                        <TextField name="roomNumber" placeholder="Room Number" disabled />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <TextField name="phoneNumber" placeholder="Phone Number" />
                      </Col>
                      <Col>
                        <SelectField name="type" allowedValues={typeList} placeholder="Room Type" />
                      </Col>
                      <Col>
                        <SelectField name="isICS" allowedValues={['Yes', 'No']} placeholder="ICS Room" />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <NumField name="chairs" placeholder="Chairs" />
                      </Col>
                      <Col>
                        <NumField name="desks" placeholder="Desks" />
                      </Col>
                      <Col>
                        <NumField name="capacity" placeholder="Capacity" />
                      </Col>
                      <Col>
                        <NumField name="squareFt" icon="user" />
                      </Col>
                    </Row>
                    <Row>
                      <TextField name="occupants" placeholder="Occupants" help="Please separate occupants by using commas." />
                    </Row>
                  </Col>
                  <Col className="col-3">
                    <ListField name="tv" placeholder="TV" />
                  </Col>
                  <Col className="col-3">
                    <ListField name="dataJacks" placeholder="Data Jacks" />
                  </Col>
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
    building: PropTypes.string,
    roomNumber: PropTypes.string,
    isICS: PropTypes.string,
    type: PropTypes.string,
    occupants: PropTypes.arrayOf(PropTypes.string),
    squareFt: PropTypes.number,
  }).isRequired,
  resources: PropTypes.shape({
    _id: PropTypes.string,
    chairs: PropTypes.number,
    desks: PropTypes.number,
    capacity: PropTypes.number,
    tv: PropTypes.arrayOf(PropTypes.shape({
      number: PropTypes.string,
      location: PropTypes.string,
    })),
    phoneNumber: PropTypes.string,
    dataJacks: PropTypes.arrayOf(PropTypes.shape({
      number: PropTypes.string,
      location: PropTypes.string,
    })),
  }).isRequired,
  faculty: PropTypes.arrayOf(PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    role: PropTypes.string,
    email: PropTypes.string,
  })).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default RoomTable;
