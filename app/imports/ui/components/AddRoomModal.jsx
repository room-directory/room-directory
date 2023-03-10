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
const locationList = ['mauka', 'makai', 'windward', 'leeward'];

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
  squareFt: Number,
  isICS: Boolean,
  capacity: Number,
  chairs: Number,
  desks: Number,
  phoneNumber: String,
  tv: [Object],
  'tv.$.number': String,
  'tv.$.location': {
    type: String,
    allowedValues: locationList,
  },
  dataJacks: [Object],
  'dataJacks.$.number': String,
  'dataJacks.$.location': {
    type: String,
    allowedValues: locationList,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddRoomModal = ({ showAddRoom, setShowAddRoom }) => {
  const submit = (data, formRef) => {
    const { roomNumber, building, type, occupants, squareFt, isICS, capacity, chairs, desks, phoneNumber, tv, dataJacks } = data;
    let definitionData = { roomNumber, building, type, occupants, squareFt };
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
              </Row>
              <Row>
                <Col>
                  <TextField name="phoneNumber" placeholder="Phone Number" />
                </Col>
                <Col>
                  <SelectField name="type" allowedValues={typeList} placeholder="Room Type" />
                </Col>
                <Col>
                  <NumField name="capacity" step={1} placeholder="Capacity" />
                </Col>
              </Row>
              <Row>
                <Col>
                  <NumField name="chairs" step={1} placeholder="Chairs" />
                </Col>
                <Col>
                  <NumField name="desks" step={1} placeholder="Desks" />
                </Col>
                <Col>
                  <NumField name="squareFt" step={1} icon="user" />
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
                  <SelectField name="location" allowedValues={locationList} placeholder="Select location" />
                </ListItemField>
              </ListField>
            </Col>
            <Col className="col-3">
              <ListField name="dataJacks" addIcon={<PlusLg className="listIcons" />} removeIcon={<Trash3 className="listIcons" />}>
                <ListItemField name="$">
                  <TextField name="number" />
                  <SelectField name="location" allowedValues={locationList} placeholder="Select location" />
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
