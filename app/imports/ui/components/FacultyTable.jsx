import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { FacultyProfiles } from '../../api/faculty/FacultyProfileCollection';

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

  /*
  const submit = () => {
    const newFirstName = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_FIRST_NAME_ADMIN).value;
    const newLastName = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_LAST_NAME_ADMIN).value;
    const newPosition = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_POSITION_ADMIN).value;

    const updateData = { id: account._id, email: account.email, firstName: newFirstName, lastName: newLastName, position: newPosition };
    const collectionName = UserProfiles.getCollectionName();

    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Profile updated successfully', 'success'));
  };

   */

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
        show ? ''
          /* <Modal show={show} onHide={() => setShow(false)} centered dialogClassName="modal-90w">
            <Modal.Header closeButton />
            <Modal.Body>
              <h4>Edit Profile</h4>
              <Form>
                <Row style={{ paddingBottom: 20 }}>
                  <Row>
                    <Col>
                      <Form.Group>
                        First Name *
                        <Form.Control id={COMPONENT_IDS.EDIT_PROFILE_FIRST_NAME_ADMIN} defaultValue={account.firstName ? account.firstName : ''} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        Last Name *
                        <Form.Control id={COMPONENT_IDS.EDIT_PROFILE_LAST_NAME_ADMIN} defaultValue={account.lastName ? account.lastName : ''} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Form.Group>
                      Position *
                      <Form.Select id={COMPONENT_IDS.EDIT_PROFILE_POSITION_ADMIN} placeholder="Select a position" options={positionList} style={{ marginBottom: 5 }} defaultValue={account.position ? account.position : ''}>
                        <option disabled>Select</option>
                        {positionList.map((name, index) => (
                          <option value={name} key={index}>{name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Row>
                </Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 25 }}>
                  <Button variant="primary" type="submit" alt="Submit Changes" onClick={submit}>
                    Submit Changes
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal> */
          : ''
      }
    </Card>
  );
};

/* Referencing the Base Collection */
FacultyTable.propTypes = {
  faculty: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    officeLocation: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default FacultyTable;
