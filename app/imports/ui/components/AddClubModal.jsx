import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import Select from 'react-select';
import swal from 'sweetalert';
import TagsInput from 'react-tagsinput';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { Club } from '../../api/club/ClubCollection';

// Schema for adding a club form.
const formSchema = new SimpleSchema({
  clubName: String,
  website: String,
  image: String,
  description: String,
  rio: [String],
});

const bridge = new SimpleSchema2Bridge(formSchema);

// Renders the modal for adding a new club. See pages/AdminManage.jsx.
const AddClubModal = ({ showAddClub, setShowAddClub, faculty }) => {

  const [error, setError] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState([]);
  const [rioList, setRioList] = useState([]);

  // format faculty for react-select field
  const facultyList = faculty.map(e => (
    {
      label: `${e.firstName} ${e.lastName}`,
      value: `${e.firstName} ${e.lastName}`,
    }
  ));

  // on change, update the advisor state
  const handleChangeAdvisor = (option) => {
    setSelectedAdvisor(option);
  };

  // on change, update the rio state
  const handleChangeRioList = (list) => {
    setRioList(list);
  };

  // on form submit, add club to the collection
  const submit = (doc, formRef) => {
    const collectionName = Club.getCollectionName();
    const definitionData = doc;
    definitionData.advisor = selectedAdvisor.map(e => e.value);
    definitionData.rio = rioList;
    // create the new Club
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((err) => setError(err.reason))
      .then(() => swal('Success', 'Club added successfully', 'success'));
    formRef.reset();
    setSelectedAdvisor([]);
    setRioList([]);
  };

  let fRef = null;
  return (
    <Modal show={showAddClub} onHide={() => { setShowAddClub(false); setRioList([]); }} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add Club</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Row>
            <TextField name="clubName" placeholder="Club Name" />
          </Row>
          <Row>
            <Col>
              <TextField name="website" placeholder="Website Link" />
            </Col>
            <Col>
              <TextField name="image" placeholder="Club Logo Link" />
            </Col>
          </Row>
          <Row>
            <TextField name="description" placeholder="Club Description" />
          </Row>
          <Row>
            <Col>
              <span>Rio Officers</span>
              <TagsInput name="rio" value={rioList} onChange={handleChangeRioList} inputProps={{ className: 'react-tagsinput-input', placeholder: 'Add an Officer......' }} />
            </Col>
          </Row>
          <Row className="py-3">
            <TextField hidden name="rio" placeholder="Rio Officers" help="Please separate names using commas." />
            <span>Club Advisor</span>
            <Select name="advisor" closeMenOnSelect={false} isMulti options={facultyList} onChange={handleChangeAdvisor} help="Please select at least 1 advisor." />
          </Row>
          <Row>
            <SubmitField value="Submit" disabled={!(selectedAdvisor.length > 0)} />
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

// Require a document to be passed to this component.
AddClubModal.propTypes = {
  showAddClub: PropTypes.bool.isRequired,
  setShowAddClub: PropTypes.func.isRequired,
  faculty: PropTypes.arrayOf(Object).isRequired,
};

export default AddClubModal;
