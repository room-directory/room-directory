import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Club } from '../../api/club/ClubCollection';

const bridge = new SimpleSchema2Bridge(Club._schema);

const ClubTable = ({ club, eventKey }) => {
  const [show, setShow] = useState(false);

  const del = () => {
    const collectionName = Club.getCollectionName();
    const instance = club._id;
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
          .then(() => swal('Club has been deleted!', {
            icon: 'success',
          }));
      } else {
        swal('Club is safe!');
      }
    });
  };

  const submit = (data) => {
    const { clubName, website, image, description, rio, advisor } = data;
    const collectionName = Club.getCollectionName();
    // convert rio and advisor to an array
    const rioArray = (rio.includes(',') ? rio.replace(/\s+/g, '').split(',') : rio);
    const advisorArray = (advisor.includes(',') ? advisor.replace(/\s+/g, '').split(',') : advisor);
    const updateData = { id: club._id, clubName, website, image, description, rio: rioArray, advisor: advisorArray };
    // edit the Club Collection
    updateMethod.callPromise({ collectionName, updateData }).catch((err) => swal('Error', err.message, 'error'))
      .then(() => swal('Success', 'Club edited successfully', 'success'));
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${club.clubName}`}</Col>
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
              <h4>Edit Club</h4>
              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={club}>
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
                  <TextField name="rio" placeholder="Rio Officers" help="Please separate names using commas." />
                </Row>
                <Row>
                  <TextField name="advisor" placeholder="Advisor" help="Please separate names using commas." />
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
ClubTable.propTypes = {
  club: PropTypes.shape({
    clubName: PropTypes.string,
    website: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    rio: PropTypes.arrayOf(PropTypes.string),
    advisor: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default ClubTable;
