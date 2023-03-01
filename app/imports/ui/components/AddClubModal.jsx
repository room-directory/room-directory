import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Modal, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Club } from '../../api/club/ClubCollection';

const formSchema = new SimpleSchema({
  clubName: String,
  website: String,
  image: String,
  description: String,
  rio: Array,
  advisor: Array,
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddClubModal = ({ showAddClub, setShowAddClub }) => {
  const [error, setError] = useState('');

  const submit = (doc, formRef) => {
    const collectionName = Club.getCollectionName();
    const definitionData = doc;
    // create the new Club
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((err) => setError(err.reason))
      .then(() => swal('Success', 'Club added successfully', 'success'));
    formRef.reset();
  };

  let fRef = null;
  return (
    <Modal show={showAddClub} onHide={() => setShowAddClub(false)} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add Club</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Row>
            <TextField name="clubName" placeholder="Club Name" />
          </Row>
          <Row>
            <TextField name="website" placeholder="Website Link" />
          </Row>
          <Row>
            <TextField name="image" placeholder="Logo Link" />
          </Row>
          <Row>
            <TextField name="description" placeholder="Description" />
          </Row>
          <Row>
            <TextField name="rio" placeholder="Officers" />
          </Row>
          <Row>
            <TextField name="advisor" placeholder="Advisor(s)" />
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
            <Alert.Heading>Adding club was not successful</Alert.Heading>
            {error}
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );
};

/* Referencing the Club Collection */
AddClubModal.propTypes = {
  showAddClub: PropTypes.bool.isRequired,
  setShowAddClub: PropTypes.func.isRequired,
};

export default AddClubModal;
