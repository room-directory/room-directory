import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Form, FormControl, Row, Table } from 'react-bootstrap';
// import { useTracker } from 'meteor/react-meteor-data';
// import { Room } from '../../api/room/RoomCollection';
// import LoadingSpinner from './LoadingSpinner';

const RoomTable = () => {

  // const { rooms, ready } = useTracker(() => {
  //   const subscription = Room.subscribeRoom();
  //   // Determine if the subscription is ready
  //   const rdy = subscription.ready();
  //   const items = Room.find({}).fetch();
  //   return {
  //     rooms: items,
  //     ready: rdy,
  //   };
  // }, []);

  const [filterText, setFilterText] = useState('');
  const [data, setData] = useState([
    { roomNumber: '301', type: 'lecture', capacity: 20 },
    { roomNumber: '315', type: 'office', capacity: 10 },
  ]);

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const addRow = () => {
    setData([
      ...data,
      { roomNumber: 'Room Number',
        type: 'Select Type',
        capacity: 'Capacity #' },
    ]);
  };

  const editRow = (index) => {
    const newData = [...data];
    newData[index].roomNumber = 'Edited Room';
    setData(newData);
  };

  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Form inline className="mb-3">
            <FormControl
              type="text"
              placeholder="Filter by room..."
              value={filterText}
              onChange={handleFilterTextChange}
            />
          </Form>
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <div className="text-right">
            <Button variant="success" onClick={addRow}>
              + Add
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((row) => row.roomNumber.toLowerCase().includes(filterText.toLowerCase())).map((row, index) => (
              <tr key={row.roomNumber}>
                <td>{row.roomNumber}</td>
                <td>{row.type}</td>
                <td>{row.capacity}</td>
                <td>
                  <Button variant="primary" onClick={() => editRow(index)}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" onClick={() => deleteRow(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

/* Referencing the Room Collection */
RoomTable.propTypes = {
  room: PropTypes.shape({
    roomNumber: PropTypes.string,
    type: PropTypes.string,
    capacity: PropTypes.number,
  }).isRequired,
};

export default RoomTable;
