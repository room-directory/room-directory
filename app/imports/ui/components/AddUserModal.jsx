import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Modal, Row, Col } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const positionList = ['student', 'faculty', 'office', 'tech'];

const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  image: String,
  position: {
    type: String,
    allowedValues: positionList,
    defaultValue: 'student',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

// Renders the modal for adding a new profile. See pages/AdminManage.jsx.
const AddUserModal = ({ showAddUser, setShowAddUser }) => {
  const [error, setError] = useState('');

  // on form submit, add profile to the collection
  const submit = (doc, formRef) => {
    const collectionName = UserProfiles.getCollectionName();
    const definitionData = doc;
    // create the new UserProfile
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((err) => setError(err.reason))
      .then(() => swal('Success', 'User added successfully', 'success'));
    formRef.reset();
  };

  let fRef = null;
  return (
    <Modal show={showAddUser} onHide={() => setShowAddUser(false)} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add User</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
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
              <TextField name="email" placeholder="Email" />
            </Col>
            <Col>
              <TextField name="password" placeholder="Password" />
            </Col>
          </Row>
          <Row>
            <TextField name="image" placeholder="Image link" />
          </Row>
          <Row>
            <SelectField name="position" placeholder="Select position" />
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
            <Alert.Heading>Adding user was not successful</Alert.Heading>
            {error}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

// Require a document to be passed to this component.
AddUserModal.propTypes = {
  showAddUser: PropTypes.bool.isRequired,
  setShowAddUser: PropTypes.func.isRequired,
};

export default AddUserModal;
