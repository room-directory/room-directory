import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Col, Modal, Row } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Select from 'react-select';
import TagsInput from 'react-tagsinput';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import { Room } from '../../api/room/RoomCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const AddFacultyModal = ({ showAddFaculty, setShowAddFaculty, rooms }) => {

  const [phoneNumberList, setPhoneNumberList] = useState([]);
  const [titleList, setTitleList] = useState([]);
  const [offices, setOffices] = useState([]);
  const [error, setError] = useState('');

  const titles = ['Associate Professor', 'Assistant Research Professor', 'Professor', 'Instructor', 'Faculty Specialist', 'Assistant Professor', 'Department Chair', 'Curriculum Committee Chair',
    'Graduate Program Chair', 'Professor Emeritus', 'Computational Scientist', 'Undergraduate Academic Advisor', 'Admin. and Fiscal Support', 'IT System Admin.', 'IT Network/System Admin.'];

  const validTitleList = titles.map(e => ({
    label: e,
    value: e,
  }));

  const validRoomList = rooms.map(e => ({
    label: `POST ${e.roomNumber}`,
    value: `POST ${e.roomNumber}`,
  }));

  validTitleList.unshift({ label: 'Not available', value: 'Not available' });
  validRoomList.unshift({ label: 'Not available', value: 'Not available' });

  const submit = (doc, formRef) => {
    let collectionName = FacultyProfiles.getCollectionName();

    const definitionData = doc;
    definitionData.officeLocation = offices.map(e => e.value);
    definitionData.phone = phoneNumberList;
    definitionData.role = titleList.map(e => e.value);
    // create the new Faculty Profile
    defineMethod.callPromise({ collectionName, definitionData })
      .catch((err) => setError(err.reason))
      .then(() => {
        const officeList = Room.find({}).fetch();
        officeList.map((office) => {
          if (definitionData.email !== null && office.occupants.includes(definitionData.email) && !definitionData.officeLocation.includes(`${office.building} ${office.roomNumber}`)) {
            office.occupants.splice(office.occupants.indexOf(definitionData.email), 1);
            collectionName = Room.getCollectionName();
            const updateData = { id: office._id, occupants: office.occupants };
            updateMethod.callPromise({ collectionName, updateData })
              .catch((err) => swal('Error', err.message, 'error'))
              .then(() => (true));
            return null;
          }
          if (definitionData.email !== null && !office.occupants.includes(definitionData.email) && definitionData.officeLocation.includes(`${office.building} ${office.roomNumber}`)) {
            office.occupants.push(definitionData.email);
            const updateData = { id: office._id, occupants: office.occupants };
            collectionName = Room.getCollectionName();
            updateMethod.callPromise({ collectionName, updateData })
              .catch((err) => swal('Error', err.message, 'error'))
              .then(() => (true));
            return null;
          }
          return null;
        });
        swal('Success', 'Faculty added successfully', 'success');
      });
    formRef.reset();
    setOffices([]);
    setPhoneNumberList([]);
    setTitleList([]);
  };

  const handleChangeOffices = (room) => setOffices(room);

  const handleChangePhoneNumbers = (list) => setPhoneNumberList(list);

  const handleChangeFacultyTitles = (list) => setTitleList(list);

  const handleHideModal = () => {
    setShowAddFaculty(false);
    setOffices([]);
    setPhoneNumberList([]);
    setTitleList([]);
  };

  let fRef = null;
  return (
    <Modal show={showAddFaculty} onHide={() => handleHideModal()} centered dialogClassName="modal-90w" className="modal-xl">
      <Modal.Header closeButton />
      <Modal.Body>
        <h4>Add Faculty</h4>
        <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Row>
            <Col>
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
                  <TextField name="image" placeholder="Image link" />
                </Col>
              </Row>
              <Row>
                <TextField name="officeHours" placeholder="Office Hours" />
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <TextField hidden name="role" placeholder="Faculty title" label="Faculty title" />
                  <span>Faculty Title</span>
                  <Select name="role" options={validTitleList} onChange={handleChangeFacultyTitles} isMulti />
                </Col>
              </Row>
              <Row className="pt-3">
                <TextField hidden name="officeLocation" placeholder="Office Location" help="Please separate offices using commas." />
                <span>Office Location</span>
                <Select name="officeLocation" options={validRoomList} onChange={handleChangeOffices} isMulti />
              </Row>
              <Row className="pt-3">
                <Col>
                  <TextField hidden name="phone" placeholder="Phone" />
                  <span>Phone Number</span>
                  <TagsInput name="phone" value={phoneNumberList} onChange={handleChangePhoneNumbers} inputProps={{ className: 'react-tagsinput-input', placeholder: 'Add a Phone Number...' }} />
                </Col>
              </Row>
            </Col>
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
