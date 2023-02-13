import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Form, FormControl, Modal, Row, Table } from 'react-bootstrap';

const ProfileTable = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedRow, setEditedRow] = useState({ email: '',
    firstName: '',
    lastName: '',
    position: '' });
  const [filterText, setFilterText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([
    { email: 'admin@foo.com',
      firstName: 'Ad',
      lastName: 'Min',
      position: 'faculty' },
    { email: 'john@foo.com',
      firstName: 'John',
      lastName: 'Foo',
      position: 'office' },
  ]);

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const addRow = (event) => {
    setData([...data, event]);
    console.log('Add form submitted');
    setShowAddModal(false);
  };

  const editRow = (id) => {
    const newData = [...data];
    // newData[index].firstName = 'Edited Name';
    // setData(newData);
    setData(data.map((row) => (row.email === id ? newData : row)));
    setShowEditModal(false);
  };

  const deleteRow = (index) => {
    setData(data.filter((row) => row.index !== index));
    setShowDeleteModal(false);
    // const newData = [...data];
    // newData.splice(index, 1);
    // setData(newData);
  };

  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Form inline className="mb-3">
            <FormControl
              type="text"
              placeholder="Filter by name..."
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
              <th>Last Name</th>
              <th>First Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.filter((row) => row.lastName.toLowerCase().includes(filterText.toLowerCase())).map((row, index) => (
              <tr key={row.email}>
                <td>{row.lastName}</td>
                <td>{row.firstName}</td>
                <td>{row.email}</td>
                <td>{row.position}</td>
                <td>
                  <Button variant="primary" onClick={() => setSelectedRow(row) && setEditedRow(row) && setShowEditModal(true)}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" onClick={() => setSelectedRow(index) && setShowDeleteModal(true)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={addRow}>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" />
              </Form.Group>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="position">
                <Form.Label>Position</Form.Label>
                <Form.Control type="text" placeholder="Enter position" />
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

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Row</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editedRow.lastName}
                  onChange={(e) => setEditedRow({ ...editedRow, lastName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editedRow.firstName}
                  onChange={(e) => setEditedRow({ ...editedRow, firstName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  value={editedRow.email}
                  onChange={(e) => setEditedRow({ ...editedRow, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="position">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  value={editedRow.position}
                  onChange={(e) => setEditedRow({ ...editedRow, position: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => editRow({ lastName: 'TODO: Update last name value', firstName: 'TODO: Update first name value', email: selectedRow.email, position: 'TODO: Update position value' })}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Row</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the row with last name "{selectedRow ? selectedRow.lastName : ''}" and email "{selectedRow ? selectedRow.email : ''}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Close
            </Button>
            <Button variant="danger" onClick={() => deleteRow(selectedRow.email)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Container>
  );
};

/* Referencing the Base Collection */
ProfileTable.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    position: PropTypes.string,
  }).isRequired,
};

export default ProfileTable;
