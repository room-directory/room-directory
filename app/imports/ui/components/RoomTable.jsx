import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, SelectField, TextField, NumField, ListField, ListItemField, AutoField } from 'uniforms-bootstrap5';
import { PlusLg, Trash3 } from 'react-bootstrap-icons';
import { updateMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const bridge = new SimpleSchema2Bridge(Room._schema.extend(RoomResources._schema));

const RoomTable = ({ room, resources, faculty, eventKey }) => {

  const [show, setShow] = useState(false);
  const typeList = ['conference', 'lecture', 'study room', 'office'];
  // combine the room and room resources object
  const combinedModel = {
    ...room,
    ...resources,
  };

  const del = () => {
    let collectionName = Room.getCollectionName();
    let instance = room._id;
    const roomName = `${room.building} ${room.roomNumber}`;
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      dangerMode: true,
      buttons: true,
    }).then((result) => {
      if (result) {
        // remove from the room collections
        removeItMethod.callPromise({ collectionName, instance })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            // remove from the room resources collection
            collectionName = RoomResources.getCollectionName();
            instance = resources._id;

            removeItMethod.callPromise({ collectionName, instance })
              .catch(error => swal('Error', error.message, 'error'))
              .then(() => {
                const facultyMembers = FacultyProfiles.find({}).fetch();
                facultyMembers.map((facultyMember) => {
                  if (facultyMember.officeLocation.includes(roomName)) {
                    facultyMember.officeLocation.splice(facultyMember.officeLocation.indexOf(roomName), 1);
                    collectionName = FacultyProfiles.getCollectionName();
                    const updateData = { id: facultyMember._id, officeLocation: facultyMember.officeLocation };
                    updateMethod.callPromise({ collectionName, updateData })
                      .catch((err) => swal('Error', err.message, 'error'))
                      .then(() => (true));
                    return null;
                  }
                  return null;
                });
                swal('Room and Room Resources has been removed from ICS!', {
                  icon: 'success',
                });
              });
          });
      } else {
        swal('Room is safe!');
      }
    });
  };

  const submit = (data) => {
    const { building, roomNumber, type, isICS, squareFt, notes, occupants, chairs, desks, phoneNumber, capacity, tv, dataJacks } = data;
    let updateData = { id: room._id, roomNumber: roomNumber, building: building, type, isICS, squareFt, notes, occupants: occupants };
    let collectionName = Room.getCollectionName();

    // update the room collection
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        // update the room resources collection
        updateData = { id: resources._id, chairs: chairs, desks: desks, phone: phoneNumber, capacity: capacity, tv: tv, dataJacks: dataJacks };
        collectionName = RoomResources.getCollectionName();

        updateMethod.callPromise({ collectionName, updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => {
            const facultyMembers = FacultyProfiles.find({}).fetch();
            facultyMembers.map((facultyMember) => {
              if (facultyMember.officeLocation.includes(`${building} ${roomNumber}`) && !occupants.includes(facultyMember.email)) {
                facultyMember.officeLocation.splice(facultyMember.officeLocation.indexOf(`${building} ${roomNumber}`), 1);
                collectionName = FacultyProfiles.getCollectionName();
                updateData = { id: facultyMember._id, officeLocation: facultyMember.officeLocation };
                updateMethod.callPromise({ collectionName, updateData })
                  .catch((err) => swal('Error', err.message, 'error'))
                  .then(() => (true));
                return null;
              }
              if (!facultyMember.officeLocation.includes(`${building} ${roomNumber}`) && occupants.includes(facultyMember.email)) {
                facultyMember.officeLocation.push(`${building} ${roomNumber}`);
                updateData = { id: facultyMember._id, officeLocation: facultyMember.officeLocation };
                collectionName = FacultyProfiles.getCollectionName();
                updateMethod.callPromise({ collectionName, updateData })
                  .catch((err) => swal('Error', err.message, 'error'))
                  .then(() => (true));
                return null;
              }
              return null;
            });
            swal('Success', 'Room updated successfully', 'success');
          });
      });

  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{room.building}</Col>
          <Col>{`${room.roomNumber}`}</Col>
          <Col>{room.type}</Col>
          <Col>
            {room.occupants.length > 0 ? room.occupants.map((people) => (
              faculty.find(x => x.email === people) ? (
                <Row>
                  {faculty.find(x => x.email === people).firstName} {faculty.find(x => x.email === people).lastName} <br />
                  {faculty.find(x => x.email === people).email}
                </Row>
              ) : <Row>{people}</Row>
            )) : 'None'}
          </Col>
          <Col>{room.isICS ? 'yes' : 'no'}</Col>
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
                      <Col>
                        <AutoField name="isICS" placeholder="ICS Room" />
                      </Col>
                      <Col>
                        <TextField name="notes" placeholder="Notes" />
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
                        <NumField name="capacity" step={1} min={0} placeholder="Capacity" />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <NumField name="chairs" step={1} min={0} placeholder="Chairs" />
                      </Col>
                      <Col>
                        <NumField name="desks" step={1} min={0} placeholder="Desks" />
                      </Col>
                      <Col>
                        <NumField name="squareFt" step={1} min={0} icon="user" />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <ListField name="occupants" style={{ maxHeight: '200px', overflowY: 'auto' }} addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />} />
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-3" style={{ paddingRight: '1.5em' }}>
                    <Row>
                      <ListField name="tv" style={{ maxHeight: '200px', overflowY: 'auto' }} addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />}>
                        <ListItemField name="$">
                          <TextField name="number" />
                          <TextField name="location" placeholder="Select location" />
                        </ListItemField>
                      </ListField>
                    </Row>
                    <Row>
                      <ListField name="dataJacks" style={{ maxHeight: '200px', overflowY: 'auto' }} addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />}>
                        <ListItemField name="$">
                          <TextField name="number" />
                          <TextField name="location" placeholder="Select location" />
                        </ListItemField>
                      </ListField>
                    </Row>
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
    isICS: PropTypes.bool,
    type: PropTypes.string,
    occupants: PropTypes.arrayOf(PropTypes.string),
    squareFt: PropTypes.number,
    notes: PropTypes.string,
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
    role: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
  })).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default RoomTable;
