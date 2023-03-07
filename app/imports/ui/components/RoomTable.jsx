import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
// import { UserProfiles } from '../../api/user/UserProfileCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { RoomResources } from '../../api/room/RoomResourceCollection';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, SelectField, TextField, NumField } from 'uniforms-bootstrap5';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';

const bridge = new SimpleSchema2Bridge(Room._schema);

const RoomTable = ({ room, resources, faculty, eventKey }) => {
  const [show, setShow] = useState(false);
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

  const typeList = ['conference', 'lecture', 'study room', 'office'];

  const submit = () => {
    const newType = document.getElementById(COMPONENT_IDS.EDIT_ROOM_TYPE_ADMIN).value;
    const newCapacity = document.getElementById(COMPONENT_IDS.EDIT_ROOM_CAPACITY_ADMIN).value;
    const newOwner = document.getElementById(COMPONENT_IDS.EDIT_ROOM_ICS_ADMIN).checked;

    const newChairs = Number(document.getElementById(COMPONENT_IDS.EDIT_CHAIRS_ADMIN).value);
    const newDesks = Number(document.getElementById(COMPONENT_IDS.EDIT_DESKS_ADMIN).value);
    const newPhone = document.getElementById(COMPONENT_IDS.EDIT_PHONE_ADMIN).value;
    const { building, roomNumber, type, isICS, squareFt, occupants } = data;
    const occupantArray = (occupants.includes(',') ? occupants.replace(/\s+/g, '').split(',') : occupants);
    let updateData = { id: room._id, roomNumber: room.roomNumber, building: room.building, type, isICS, squareFt, occupants: occupantArray };
    let collectionName = Room.getCollectionName();

    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Room updated successfully', 'success'));

    console.log(room);

    updateData = { id: resources._id, chairs: newChairs, desks: newDesks, phone: newPhone, capacity: newCapacity };
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
          <Modal show={show} onHide={() => setShow(false)} centered dialogClassName="modal-90w">
            <Modal.Header closeButton />
            <Modal.Body>
              <h4>Edit Room</h4>
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={room}>
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
                    Is Managed by ICS Department *
                    <Form.Check id={COMPONENT_IDS.EDIT_ROOM_ICS_ADMIN} defaultChecked={room.isICS} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    Room Capacity *
                    <Form.Control id={COMPONENT_IDS.EDIT_ROOM_CAPACITY_ADMIN} defaultValue={resources.capacity ? resources.capacity : ''} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    Chairs *
                    <Form.Control id={COMPONENT_IDS.EDIT_CHAIRS_ADMIN} defaultValue={resources.chairs ? resources.chairs : ''} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    Desks *
                    <Form.Control id={COMPONENT_IDS.EDIT_DESKS_ADMIN} defaultValue={resources.desks ? resources.desks : ''} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    TVs *
                    {resources.tv.map((tvs) => (
                      <Row key={tvs.value}>
                        <Col><Form.Control defaultValue={tvs.location ? tvs.location : ''} /></Col>
                        <Col><Form.Control defaultValue={tvs.number ? tvs.number : ''} /></Col>
                        <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button>-</Button>
                        </Col>
                      </Row>
                    ))}
                    <Button>Add TV</Button>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    Phone # *
                    <Form.Control id={COMPONENT_IDS.EDIT_PHONE_ADMIN} defaultValue={resources.phoneNumber ? resources.phoneNumber : ''} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    Data Jacks *
                      {resources.dataJacks.map((jack) => (
                        <Row key={jack.value}>
                          <Col>
                            <Form.Control defaultValue={jack.location ? jack.location : ''} />
                          </Col>
                          <Col>
                            <Form.Control defaultValue={jack.number ? jack.number : ''} />
                          </Col>
                          <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button>-</Button>
                          </Col>
                        </Row>
                      ))}
                      <Button>Add Jack</Button>
                    </Form.Group>
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
    building: PropTypes.string,
    roomNumber: PropTypes.string,
    isICS: PropTypes.bool,
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
