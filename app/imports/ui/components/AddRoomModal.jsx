import React from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoField, AutoForm, ErrorsField, ListField, ListItemField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
// import { UserProfiles } from '../../api/user/UserProfileCollection';
import { PlusLg, Trash3 } from 'react-bootstrap-icons';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import { RoomResources } from '../../api/room/RoomResourceCollection';

const typeList = ['conference', 'lecture', 'study room', 'office'];
const buildingList = ['POST', 'building2'];

const formSchema = new SimpleSchema({
  roomNumber: String,
  building: {
    type: String,
    allowedValues: buildingList,
    defaultValue: 'POST',
  },
  type: {
    type: String,
    allowedValues: typeList,
    defaultValue: 'conference',
  },
  occupants: Array,
  'occupants.$': String,
  squareFt: {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
  isICS: {
    type: Boolean,
    defaultValue: false,
  },
  capacity: {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
  chairs: {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
  desks: {
    type: Number,
    min: 0,
    defaultValue: 0,
  },
  phoneNumber: {
    type: String,
    defaultValue: 'None',
  },
  tv: [Object],
  'tv.$.number': String,
  'tv.$.location': {
    type: String,
  },
  dataJacks: [Object],
  'dataJacks.$.number': String,
  'dataJacks.$.location': {
    type: String,
  },
  notes: {
    type: String,
    defaultValue: 'None',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddRoomModal = ({ showAddRoom, setShowAddRoom }) => {
  const submit = (data, formRef) => {
    const { roomNumber, building, type, occupants, squareFt, isICS, capacity, chairs, desks, phoneNumber, tv, dataJacks, notes } = data;
    let definitionData = { roomNumber, building, type, occupants, squareFt, notes };
    let collectionName = Room.getCollectionName();
    if (Room.findOne({ roomNumber: data.roomNumber, building: data.building })) {
      swal('Error', 'That room exists already!', 'error');
    } else {
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          collectionName = RoomResources.getCollectionName();
          definitionData = { roomNumber, isICS, capacity, chairs, desks, phoneNumber, tv, dataJacks };
          defineMethod.callPromise({ collectionName, definitionData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => swal('Success', 'Room added successfully', 'success'));
        });
    }
    formRef.reset();
  };

  let fRef = null;
  return (
    <Modal show={showAddRoom} onHide={() => setShowAddRoom(false)} centered dialogClassName="modal-90w" className="modal-xl">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add Room</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Row>
            <Col>
              <Row>
                <Col>
                  <TextField name="building" placeholder="Building" />
                </Col>
                <Col>
                  <TextField name="roomNumber" placeholder="Room Number" />
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
                <ListField name="occupants" addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />} />
              </Row>
            </Col>
            <Col className="col-3">
              <ListField name="tv" addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />}>
                <ListItemField name="$">
                  <TextField name="number" />
                  <TextField name="location" placeholder="Select location" />
                </ListItemField>
              </ListField>
            </Col>
            <Col className="col-3">
              <ListField name="dataJacks" addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />}>
                <ListItemField name="$">
                  <TextField name="number" />
                  <TextField name="location" placeholder="Select location" />
                </ListItemField>
              </ListField>
            </Col>
          </Row>
          <SubmitField value="Submit" />
          <ErrorsField />
        </AutoForm>
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
