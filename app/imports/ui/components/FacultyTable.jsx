import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Select from 'react-select';
import TagsInput from 'react-tagsinput';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';
import { Room } from '../../api/room/RoomCollection';

const bridge = new SimpleSchema2Bridge(FacultyProfiles._schema);

const FacultyTable = ({ faculty, eventKey, rooms }) => {

  const facultyOffices = faculty.officeLocation.map(e => (
    {
      label: e,
      value: e,
    }
  ));

  const facultyTitles = faculty.role.map(e => (
    {
      label: e,
      value: e,
    }
  ));

  const validRoomList = rooms.map(e => ({
    label: `POST ${e.roomNumber}`,
    value: `POST ${e.roomNumber}`,
  }));

  const [show, setShow] = useState(false);
  const [offices, setOffices] = useState(facultyOffices);
  const [phoneNumberList, setPhoneNumberList] = useState(faculty.phone);
  const [titleList, setTitleList] = useState(facultyTitles);

  const handleChangeOffices = (room) => setOffices(room);

  const handleChangePhoneNumbers = (list) => setPhoneNumberList(list);

  const handleChangeFacultyTitles = (list) => setTitleList(list);

  const handleHideModal = () => setShow(false);

  const titles = ['Associate Professor', 'Assistant Research Professor', 'Professor', 'Instructor', 'Faculty Specialist', 'Assistant Professor', 'Department Chair', 'Curriculum Committee Chair',
    'Graduate Program Chair', 'Professor Emeritus', 'Computational Scientist', 'Undergraduate Academic Advisor', 'Admin. and Fiscal Support', 'IT System Admin.', 'IT Network/System Admin.'];

  const validTitleList = titles.map(e => ({
    label: e,
    value: e,
  }));

  const del = () => {
    let collectionName = FacultyProfiles.getCollectionName();
    const instance = faculty._id;
    const facultyMember = faculty.email;
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
          .then(() => {
            const officeList = Room.find({}).fetch();
            officeList.map((office) => {
              if (facultyMember !== null && office.occupants.includes(facultyMember)) {
                office.occupants.splice(office.occupants.indexOf(facultyMember), 1);
                collectionName = Room.getCollectionName();
                const updateData = { id: office._id, occupants: office.occupants };
                updateMethod.callPromise({ collectionName, updateData })
                  .catch((err) => swal('Error', err.message, 'error'))
                  .then(() => (true));
                return null;
              }
              return null;
            });
            swal('Faculty has been deleted!', {
              icon: 'success',
            });
          });
      } else {
        swal('Faculty is safe!');
      }
    });
  };

  const submit = (data) => {
    const { firstName, lastName, role, image, email, officeLocation, officeHours } = data;
    let collectionName = FacultyProfiles.getCollectionName();
    // convert phone numbers, job titles, and office locations to an array
    // const phoneArray = (phone.includes(',') ? phone.replace(/\s+/g, '').split(',') : phone);
    let officeLocationArray = (officeLocation.includes(',') ? officeLocation.split(',').map((office) => office.trim()) : officeLocation);
    const titleArray = (role.includes(',') ? role.replace(/\s+/g, '').split(',') : role);
    const updateData = { id: faculty._id, phone: phoneNumberList, firstName, lastName, role: titleArray, image, email, officeLocation: officeLocationArray, officeHours };
    updateData.officeLocation = offices.map(e => e.value);
    updateData.role = titleList.map(e => e.value);
    officeLocationArray = updateData.officeLocation;
    // edit the FacultyProfiles collection
    updateMethod.callPromise({ collectionName, updateData })
      .catch((err) => swal('Error', err.message, 'error'))
      .then(() => {
        const officeList = Room.find({}).fetch();
        officeList.map((office) => {
          if (email !== null && office.occupants.includes(email) && !officeLocationArray.includes(`${office.building} ${office.roomNumber}`)) {
            office.occupants.splice(office.occupants.indexOf(email), 1);
            collectionName = Room.getCollectionName();
            updateData = { id: office._id, occupants: office.occupants };
            updateMethod.callPromise({ collectionName, updateData })
              .catch((err) => swal('Error', err.message, 'error'))
              .then(() => (true));
            return null;
          }
          if (!office.occupants.includes(email) && officeLocationArray.includes(`${office.building} ${office.roomNumber}`)) {
            office.occupants.push(email);
            updateData = { id: office._id, occupants: office.occupants };
            collectionName = Room.getCollectionName();
            updateMethod.callPromise({ collectionName, updateData })
              .catch((err) => swal('Error', err.message, 'error'))
              .then(() => (true));
            return null;
          }
          return null;
        });
        swal('Success', 'Faculty edited successfully', 'success');
      });
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
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => { setShow(true); setOffices(facultyOffices); }}>Edit</Button></Col>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="danger" onClick={del}>Delete</Button></Col>
            </Row>
          </Col>
        </Row>
      </Card.Header>

      {
        show ? (
          <Modal show={show} onHide={() => handleHideModal()} centered dialogClassName="faculty-table-modal" className="modal-xl">
            <Modal.Header closeButton />
            <Modal.Body>
              <h4>Edit Faculty</h4>
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={faculty}>
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
                        <Select name="role" defaultValue={facultyTitles} options={validTitleList} onChange={handleChangeFacultyTitles} isMulti />
                      </Col>
                    </Row>
                    <Row className="pt-3">
                      <TextField hidden name="officeLocation" placeholder="Office Location" help="Please separate offices using commas." />
                      <span>Office Location</span>
                      <Select name="officeLocation" defaultValue={facultyOffices} options={validRoomList} onChange={handleChangeOffices} isMulti />
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
