import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const FacultyTable = ({ faculty, eventKey }) => {
  const [show, setShow] = useState(false);

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
    // edit the FacultyProfiles collection
    updateMethod.callPromise({ collectionName, updateData })
      .catch((err) => swal('Error', err.message, 'error'))
      .then(() => swal('Success', 'Faculty edited successfully', 'success'));
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${faculty.lastName}`}</Col>
          <Col>{`${faculty.firstName}`}</Col>
          <Col>{faculty.email}</Col>
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
          <Modal show={show} onHide={() => setShow(false)} centered dialogClassName="modal-90w">
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
                    <TextField name="role" placeholder="Faculty role" label="Job Title" />
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
                  <TextField name="officeLocation" placeholder="Office Location" help="Please separate offices using commas." />
                </Row>
                <Row>
                  <TextField name="officeHours" placeholder="Office Hours" />
                </Row>
                <Row>
                  <SubmitField value="Submit" />
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
    role: PropTypes.string,
    officeLocation: PropTypes.arrayOf(PropTypes.string),
    phone: PropTypes.arrayOf(PropTypes.string),
    officeHours: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default FacultyTable;
