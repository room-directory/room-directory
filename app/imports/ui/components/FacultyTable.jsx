import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Select from 'react-select';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const FacultyTable = ({ faculty, eventKey, rooms }) => {
  const [show, setShow] = useState(false);
  const facultyOffices = faculty.officeLocation.map(e => (
    {
      label: e,
      value: e,
    }
  ));
  const [offices, setOffices] = useState(facultyOffices);
  const handleChangeOffices = (room) => setOffices(room);
  console.log(faculty.officeLocation);
  const roomList = rooms.map(e => ({
    label: `POST ${e.roomNumber}`,
    value: `POST ${e.roomNumber}`,
  }));

  const titles = ['Associate Professor', 'Assistant Research Professor', 'Professor', 'Instructor', 'Faculty Specialist', 'Assistant Professor', 'Department Chair', 'Curriculum Committee Chair',
    'Graduate Program Chair', 'Professor Emeritus', 'Computational Scientist', 'Undergraduate Academic Advisor', 'Admin. and Fiscal Support', 'IT System Admin.', 'IT Network/System Admin.'];

  const del = () => {
    const collectionName = FacultyProfiles.getCollectionName();
    const instance = faculty._id;
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
          .then(() => swal('Faculty has been deleted!', {
            icon: 'success',
          }));
      } else {
        swal('Faculty is safe!');
      }
    });
  };

  const submit = (data) => {
    const { firstName, lastName, role, image, email, phone, officeLocation, officeHours } = data;
    const collectionName = FacultyProfiles.getCollectionName();
    // convert phone numbers and office locations to an array
    const phoneArray = (phone.includes(',') ? phone.replace(/\s+/g, '').split(',') : phone);
    const officeLocationArray = (officeLocation.includes(',') ? officeLocation.replace(/\s+/g, '').split(',') : officeLocation);
    const updateData = { id: faculty._id, phone: phoneArray, firstName, lastName, role, image, email, officeLocation: officeLocationArray, officeHours };
    updateData.officeLocation = offices.map(e => e.value);
    // edit the FacultyProfiles collection
    updateMethod.callPromise({ collectionName, updateData })
      .catch((err) => swal('Error', err.message, 'error'))
      .then(() => swal('Success', 'Faculty edited successfully', 'success'));
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${faculty.firstName}`} {`${faculty.lastName}`}</Col>
          <Col>{faculty.email}</Col>
          <Col>{faculty.role.map((role) => <div>{role}</div>)}</Col>
          <Col>{faculty.officeLocation.map((office) => <div>{office}</div>)}</Col>
          <Col xs={2}>
            <Row>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => setShow(true)}>Edit</Button></Col>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="danger" onClick={del}>Delete</Button></Col>
            </Row>
          </Col>
        </Row>
      </Card.Header>

      {
        show ? (
          <Modal show={show} onHide={() => { setShow(false); setOffices([]); }} centered dialogClassName="faculty-table-modal">
            <Modal.Header closeButton />
            <Modal.Body>
              <h4>Edit Faculty</h4>
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={faculty}>
                <Row>
                  <Col>
                    <TextField name="firstName" placeholder="First name" />
                  </Col>
                  <Col>
                    <TextField name="lastName" placeholder="Last name" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <SelectField name="role" placeholder="Faculty title" label="Faculty title(s)" allowedValues={titles} appearance="checkbox" />
                  </Col>
                  <Col>
                    <TextField name="email" placeholder="Email" />
                  </Col>
                </Row>
                <Row>
                  <TextField name="image" placeholder="Image link" />
                </Row>
                <Row>
                  <TextField name="phone" placeholder="Phone" help="Please separate phone numbers using commas." />
                </Row>
                <Row>
                  <Select defaultValue={facultyOffices} options={roomList} onChange={handleChangeOffices} isMulti />
                  <span>Please select at least 1 office.</span>
                </Row>
                <Row>
                  <TextField name="officeHours" placeholder="Office Hours" />
                </Row>
                <Row>
                  <SubmitField value="Submit" disabled={offices.length <= 0} />
                  <ErrorsField />
                </Row>
              </AutoForm>
            </Modal.Body>
          </Modal>
        ) : ''
      }
    </Card>
  );
};

/* Referencing the Base Collection */
FacultyTable.propTypes = {
  faculty: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    image: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.arrayOf(PropTypes.string),
    officeLocation: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.arrayOf(PropTypes.string),
    officeHours: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
  rooms: PropTypes.arrayOf(Object).isRequired,
};

export default FacultyTable;
