import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Form, FormControl, Modal, Row, Table } from 'react-bootstrap';

const RoomTable = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [data, setData] = useState([
    { roomNumber: '301', type: 'lecture', capacity: 20 },
    { roomNumber: '315', type: 'office', capacity: 10 },
  ]);

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const addRow = (event) => {
    setData([...data, event]);
    console.log('Add form submitted');
    setShowAddModal(false);
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
            <Button variant="success" onClick={() => setShowAddModal(true)}>
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

        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={addRow}>
              <Form.Group controlId="roomNumber">
                <Form.Label>Room Number</Form.Label>
                <Form.Control type="text" placeholder="Enter room number" />
              </Form.Group>
              <Form.Group controlId="type">
                <Form.Label>Type</Form.Label>
                <Form.Control type="text" placeholder="Enter type" />
              </Form.Group>
              <Form.Group controlId="capacity">
                <Form.Label>Capacity</Form.Label>
                <Form.Control type="number" placeholder="Enter capacity" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button variant="primary">Save</Button>
          </Modal.Footer>
        </Modal>

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
