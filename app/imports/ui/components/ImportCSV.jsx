import React from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, Row, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { useTracker } from 'meteor/react-meteor-data';
import { AutoField, AutoForm, ErrorsField, ListField, ListItemField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { PlusLg, Trash3 } from 'react-bootstrap-icons';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { Room } from '../../api/room/RoomCollection';
import LoadingSpinner from './LoadingSpinner';
import { RoomResources } from '../../api/room/RoomResourceCollection';

const typeList = ['conference', 'lecture', 'study room', 'office'];
const buildingList = ['POST', 'building2'];
const locationList = ['mauka', 'makai', 'windward', 'leeward'];
const formSchema = new SimpleSchema({
  importCSV: {
    type: File,
    optional: false,
  },
});

// // const formSchema = new SimpleSchema({
//   roomNumber: String,
//   building: {
//     type: String,
//     allowedValues: buildingList,
//     defaultValue: 'POST',
//   },
//   type: {
//     type: String,
//     allowedValues: typeList,
//     defaultValue: 'conference',
//   },
//   occupants: Array,
//   'occupants.$': String,
//   squareFt: Number,
//   isICS: Boolean,
//   capacity: Number,
//   chairs: Number,
//   desks: Number,
//   phoneNumber: String,
//   tv: [Object],
//   'tv.$.number': String,
//   'tv.$.location': {
//     type: String,
//     allowedValues: locationList,
//   },
//   dataJacks: [Object],
//   'dataJacks.$.number': String,
//   'dataJacks.$.location': {
//     type: String,
//     allowedValues: locationList,
//   },
// });

const bridge = new SimpleSchema2Bridge(formSchema);

const ImportCSV = ({ showImportCSV, setShowImportCSV }) => {
  const { ready, resources } = useTracker(() => {
    const subscription = RoomResources.subscribeRoomResourceAdmin();
    const rdy = subscription.ready();
    const roomResource = RoomResources.find({}, {}).fetch();
    return {
      resources: roomResource,
      ready: rdy,
    };
  }, []);
  const submit = (event) => {
    event.preventDefault();
    const csvFile = document.getElementById('importCSV').files[0];
    const reader = new FileReader();
    reader.readAsText(csvFile);
    reader.onloadend = () => {
      // console.log(reader.result);
      const csvArray = reader.result.split('\r\n');
      console.log(csvArray.length);
      csvArray.pop();
      csvArray.shift();
      let newArray = csvArray.map(e => (e.split(',')));
      newArray = newArray.filter(e => e[1] !== '');
      const newObjectArray = [];
      newArray.forEach(e => {
        const csvRoomNumber = e[1].replace('POST ', '');
        const csvPortNumber = e[0];
        const csvLocation = e[2] ? e[2] : 'unknown';
        const portObject = {
          number: csvPortNumber,
          location: csvLocation,
        };
        // const indexOfRoom = .findIndex(element => (Object.keys(element) === csvRoomNumber));
        // console.log(indexOfRoom);
        // if (indexOfRoom >= 0) {
        //   newObjectArray[indexOfRoom][csvRoomNumber].push(portObject);
        // } else {
        //   newObjectArray.push({ [csvRoomNumber]: portObject });
        // }

        newObjectArray.push({ [csvRoomNumber]: [portObject] });
        // const room = resources.e;
        // console.log(roomResourceItem);
      });
      const newNewObjectArray = [];
      newObjectArray.forEach(e => {
        const key = Object.keys(e)[0];
        const index = newNewObjectArray.findIndex((element) => Object.keys(element)[0] === key);
        if (index >= 0) {
          newNewObjectArray[index][key].push(e[key][0]);
        } else {
          newNewObjectArray.push(e);
        }
      });
      // console.log(newObjectArray);
      console.log(newNewObjectArray);
      // console.log(resources);
      console.log(resources.find(element => element.roomNumber === Object.keys(newNewObjectArray[0])[0]));
      newNewObjectArray.forEach(e => {
        let resourceDocument = resources.find(element => (element.roomNumber === Object.keys(e)[0]));
        if (resourceDocument) {
          let updateData = resourceDocument;
          let collectionName = RoomResources.getCollectionName();
          updateData.dataJacks = Object.values(e)[0];
          console.log(updateData);
          updateMethod.callPromise({ collectionName, updateData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => swal('Success', 'Item updated successfully', 'success'));
        } else {
          console.log('Room not in database');
        }
      });
    };
    // const { roomNumber, building, type, occupants, squareFt, isICS, capacity, chairs, desks, phoneNumber, tv, dataJacks } = data;
    // let definitionData = { roomNumber, building, type, occupants, squareFt };
    // let collectionName = Room.getCollectionName();
    // if (Room.findOne({ roomNumber: data.roomNumber, building: data.building })) {
    //   swal('Error', 'That room exists already!', 'error');
    // } else {
    //   defineMethod.callPromise({ collectionName, definitionData })
    //     .catch(error => swal('Error', error.message, 'error'))
    //     .then(() => {
    //       collectionName = RoomResources.getCollectionName();
    //       definitionData = { roomNumber, isICS, capacity, chairs, desks, phoneNumber, tv, dataJacks };
    //       defineMethod.callPromise({ collectionName, definitionData })
    //         .catch(error => swal('Error', error.message, 'error'))
    //         .then(() => swal('Success', 'Room added successfully', 'success'));
    //     });
    // }
    // formRef.reset();
  };

  const fRef = null;
  return (ready ? (
    <Modal show={showImportCSV} onHide={() => setShowImportCSV(false)} centered dialogClassName="modal-90w" className="modal-xl">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Import CSV</h4>
        <Row>
          <Form onSubmit={submit}>
            <Col>
              <Row>
                <Col>
                  <Form.Control required id="importCSV" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </Col>
              </Row>
            </Col>
            <Button variant="success" type="submit">Save</Button>
          </Form>
        </Row>
      </Modal.Body>
    </Modal>
  ) : <LoadingSpinner />
  );
};

/* Referencing the Room Collection */
ImportCSV.propTypes = {
  showImportCSV: PropTypes.bool.isRequired,
  setShowImportCSV: PropTypes.func.isRequired,
};

export default ImportCSV;
