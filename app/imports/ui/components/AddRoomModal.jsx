import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
// import { UserProfiles } from '../../api/user/UserProfileCollection';
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
  squareFt: Number,
});
const bridge = new SimpleSchema2Bridge(formSchema);
const AddRoomModal = ({ showAddRoom, setShowAddRoom }) => {
  const submit = (data, formRef) => {
    const { roomNumber, building, type, occupants, squareFt } = data;
    let definitionData = { roomNumber, building, type, occupants, squareFt };
    let collectionName = Room.getCollectionName();
    if (Room.findOne({ roomNumber: data.roomNumber, building: data.building })) {
      swal('Error', 'That room exists already!', 'error');
    } else {
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => swal('Success', 'Room added successfully', 'success'));
      collectionName = RoomResources.getCollectionName();
      definitionData = { roomNumber, capacity: -1, chairs: -1, desks: -1, phoneNumber: '-1', tv: [{ number: 'unknown', location: 'somewhere' }], dataJacks: [{ number: 'unkown', location: 'somewhere' }] };
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'));
    }
    formRef.reset();
  };

  let fRef = null;
  return (

    <Modal show={showAddRoom} onHide={() => setShowAddRoom(false)} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Room Information</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Row>
            <TextField name="roomNumber" />
          </Row>
          <Row>
            <SelectField name="building" />
          </Row>
          <Row>
            <SelectField name="type" />
          </Row>
          <Row>
            <TextField name="occupants" />
          </Row>
          <Row>
            <NumField name="squareFt" />
          </Row>
          <Row>
            <SubmitField value="Submit" />
            <ErrorsField />
          </Row>
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
