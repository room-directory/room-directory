import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, Row, Form, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { useTracker } from 'meteor/react-meteor-data';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import LoadingSpinner from './LoadingSpinner';
import { RoomResources } from '../../api/room/RoomResourceCollection';

const ImportCSV = ({ showImportCSV, setShowImportCSV }) => {
  const [missingRooms, setMissingRooms] = useState('');
  const [append, setAppend] = useState(false);
  const missingRoom = [];
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
    setMissingRooms('');
    const csvFile = document.getElementById('importCSV').files[0];
    const reader = new FileReader();
    reader.readAsText(csvFile);
    reader.onloadend = () => {
      const csvArray = reader.result.split('\r\n');
      // console.log(csvArray.length);
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
        newObjectArray.push({ [csvRoomNumber]: [portObject] });
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
      newNewObjectArray.forEach(e => {
        const resourceDocument = resources.find(element => (element.roomNumber === Object.keys(e)[0]));
        if (resourceDocument) {
          const updateData = resourceDocument;
          const collectionName = RoomResources.getCollectionName();
          if (append) {
            updateData.dataJacks = updateData.dataJacks.concat(Object.values(e)[0]);
          } else {
            updateData.dataJacks = Object.values(e)[0];
          }
          updateData.id = updateData._id;
          delete updateData._id;
          updateMethod.callPromise({ collectionName, updateData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => swal('Success', 'Item updated successfully', 'success'));
        } else {
          console.log(Object.keys(e)[0]);
          missingRoom.push(Object.keys(e)[0]);
          console.log(missingRoom.toString().replaceAll(',', ', '));
        }
      });
      setMissingRooms(missingRoom.toString().replaceAll(',', ', '));
      console.log(missingRooms);
    };
    console.log(missingRoom);
    setMissingRooms(missingRoom);
    console.log(missingRooms);
  };
  const downloadCSV = () => {
    const portInfo = [];
    resources.forEach(e => {
      e.dataJacks.forEach(port => {
        const tempArr = [];
        tempArr.push(port.number);
        tempArr.push(e.roomNumber);
        tempArr.push(port.location);
        portInfo.push(tempArr);
      });
    });
    console.log(portInfo);
    let portCSVFileContent = 'port number,room number,location\r\n';
    portInfo.forEach(e => {
      portCSVFileContent += `${e.toString()}\r\n`;
    });
    console.log(portCSVFileContent);
    const csvFile = `data:text/csv;charset=utf-8,${encodeURI(portCSVFileContent)}`;
    console.log(csvFile);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = csvFile;
    hiddenElement.target = '_blank';
    hiddenElement.download = 'PortInfo.csv';
    hiddenElement.click();
  };

  return (ready ? (
    <Modal show={showImportCSV} onHide={() => { setShowImportCSV(false); setMissingRooms(''); }} centered dialogClassName="modal-90w" className="modal-xl">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Port information</h4>
        <Row>
          <Form onSubmit={submit}>
            <Col>
              <Row>
                <Col>
                  <Form.Control required id="importCSV" type="file" accept=".csv" />
                </Col>
              </Row>
            </Col>
            <Button className="m-2" variant="success" type="submit">Import port info</Button>
            <Button className="m-2" variant="success" onClick={downloadCSV}>
              Download port info
            </Button>
            <Button className="m-2" onClick={() => setAppend(!append)}>
              {append ? 'Concat data' : 'Overwrite data'}
            </Button>
          </Form>
          {missingRooms ? (
            <div className="alert alert-warning" role="alert">
              Rooms not in database: {missingRooms}
            </div>
          )
            : ''}

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
