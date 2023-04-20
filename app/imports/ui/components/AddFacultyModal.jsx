import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Modal, Row, Badge, CloseButton } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Select from 'react-select';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const AddFacultyModal = ({ showAddFaculty, setShowAddFaculty, rooms }) => {

  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [phoneNumberList, setPhoneNumberList] = useState([]);
  const [offices, setOffices] = useState([]);

  const [error, setError] = useState('');
  const roomList = rooms.map(e => ({
    label: `POST ${e.roomNumber}`,
    value: `POST ${e.roomNumber}`,
  }));
  roomList.unshift({ label: 'Not available', value: 'Not available' });

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
    setCurrentPhoneNumber('');
  };

  const handleChangeOffices = (room) => setOffices(room);

  const handleChangePhoneNumbers = (number) => setCurrentPhoneNumber(number);

  const handleKeyPress = (target) => {
    if (target.key === 'Enter') {
      // add current phone number to the list
      setPhoneNumberList([...phoneNumberList, currentPhoneNumber]);
      setCurrentPhoneNumber('');
    }
  };

  const handleDelete = (number) => {
    const index = phoneNumberList.findIndex(number);
    if (index !== -1) {
      const newList = phoneNumberList.splice(index, 1);
      setPhoneNumberList(newList);
    }
  };

  let fRef = null;
  return (
    <Modal show={showAddFaculty} onHide={() => { setShowAddFaculty(false); setOffices([]); }} centered dialogClassName="modal-90w">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add Faculty</h4>
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
            <TextField name="phone" placeholder="Phone" value={currentPhoneNumber} onChange={handleChangePhoneNumbers} onKeyDown={handleKeyPress} />
            {phoneNumberList.length > 0 ? (
              <div>
                {phoneNumberList.map((number, index) => (
                  <Badge key={index} bg="success" className="mx-1 p-2">
                    {number}
                    <CloseButton variant="white" onClick={handleDelete(number)} />
                  </Badge>
                ))}
              </div>
            ) : ''}
          </Row>
          <Row className="py-3">
            <TextField hidden name="officeLocation" placeholder="Office Location" help="Please separate offices using commas." />
            <span>Office Location</span>
            <Select name="officeLocation" options={roomList} onChange={handleChangeOffices} isMulti />
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
