import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Form, FormControl, Row, Table } from 'react-bootstrap';

const ProfileTable = () => {
  const [filterText, setFilterText] = useState('');
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

  const addRow = () => {
    setData([
      ...data,
      { email: 'New email',
        firstName: 'New Name',
        lastName: 'New Name',
        position: 'Position' },
    ]);
  };

  const editRow = (index) => {
    const newData = [...data];
    newData[index].firstName = 'Edited Name';
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
              placeholder="Filter by name..."
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
