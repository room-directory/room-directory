import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Select from 'react-select';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const AddFacultyModal = ({ showAddFaculty, setShowAddFaculty, rooms }) => {
  const [error, setError] = useState('');
  const roomList = rooms.map(e => ({
    label: `POST ${e.roomNumber}`,
    value: `POST ${e.roomNumber}`,
  }));
  roomList.unshift({ label: 'Not available', value: 'Not available' });
  const [offices, setOffices] = useState([]);
  const handleChangeOffices = (room) => setOffices(room);
  const submit = (doc, formRef) => {
    const collectionName = FacultyProfiles.getCollectionName();

    const definitionData = doc;
    definitionData.officeLocation = offices.map(e => e.value);
    // create the new Faculty Profile
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((err) => setError(err.reason))
      .then(() => swal('Success', 'Faculty added successfully', 'success'));
    formRef.reset();
    setOffices([]);
  };

  let fRef = null;
  return (
    <Modal show={showAddFaculty} onHide={() => { setShowAddFaculty(false); setOffices([]); }} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add Faculty</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Row>
            <TextField name="firstName" placeholder="First name" />
          </Row>
          <Row>
            <TextField name="lastName" placeholder="Last name" />
          </Row>
          <Row>
            <Col>
              <TextField name="role" placeholder="Faculty title" label="Faculty title" />
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
            <TextField hidden name="officeLocation" placeholder="Office Location" help="Please separate offices using commas." />
            <Select name="officeLocation" options={roomList} onChange={handleChangeOffices} isMulti />
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
        {error === '' ? (
          ''
        ) : (
          <Alert variant="danger">
            <Alert.Heading>Adding faculty was not successful</Alert.Heading>
            {error}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

/* Referencing the Room Collection */
AddFacultyModal.propTypes = {
  showAddFaculty: PropTypes.bool.isRequired,
  setShowAddFaculty: PropTypes.func.isRequired,
  rooms: PropTypes.arrayOf(Object).isRequired,
};

export default AddFacultyModal;
