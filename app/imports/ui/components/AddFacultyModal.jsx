import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const AddFacultyModal = ({ showAddFaculty, setShowAddFaculty }) => {
  const [error, setError] = useState('');

  const submit = (doc, formRef) => {
    const collectionName = FacultyProfiles.getCollectionName();
    const definitionData = doc;
    // create the new Faculty Profile
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((err) => setError(err.reason))
      .then(() => swal('Success', 'Faculty added successfully', 'success'));
    formRef.reset();
  };

  let fRef = null;
  return (
    <Modal show={showAddFaculty} onHide={() => setShowAddFaculty(false)} centered dialogClassName="modal-90w">
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
};

export default AddFacultyModal;
