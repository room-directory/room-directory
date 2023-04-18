import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import { AutoForm, ErrorsField, SubmitField, TextField, SelectField } from 'uniforms-bootstrap5';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { updateUserPasswordMethod } from '../../api/user/UserProfileCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const positionList = ['student', 'faculty', 'office', 'tech'];

const formSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  password: {
    type: String,
    optional: true,
  },
  image: String,
  position: {
    type: String,
    allowedValues: positionList,
    defaultValue: 'student',
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const ProfileTable = ({ account, eventKey }) => {
  const [show, setShow] = useState(false);
  const del = () => {
    const collectionName = UserProfiles.getCollectionName();
    const instance = account._id;
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
          .then(() => swal('Profile has been deleted!', {
            icon: 'success',
          }));
      } else {
        swal('Profile is safe!');
      }
    });
  };

  const submit = (data) => {
    const { firstName, lastName, password, email, position } = data;
    const updateData = { id: account._id, email, firstName, lastName, position };
    const collectionName = UserProfiles.getCollectionName();
    console.log(password);
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        if (password) {
          updateUserPasswordMethod.callPromise({ email, password })
            .catch(error => swal('Error', error.message, 'error'));
        }
        swal('Success', 'Profile updated successfully', 'success');
      });
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${account.firstName}`} {`${account.lastName}`}</Col>
          <Col>{account.email}</Col>
          <Col>{account.position}</Col>
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
              <h4>Edit Profile</h4>
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={account}>
                <Row>
                  <Col>
                    <TextField name="firstName" placeholder="First name" />
                  </Col>
                  <Col>
                    <TextField name="lastName" placeholder="Last name" />
                  </Col>
                </Row>
                <Row>
                  <TextField name="password" placeholder="Enter new password" />
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
            </Modal.Body>
          </Modal>
        ) : ''
      }
    </Card>
  );
};

/* Referencing the Base Collection */
ProfileTable.propTypes = {
  account: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    image: PropTypes.string,
    position: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default ProfileTable;
