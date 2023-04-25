import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import Select from 'react-select';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import TagsInput from 'react-tagsinput';
import { removeItMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { Club } from '../../api/club/ClubCollection';

const bridge = new SimpleSchema2Bridge(Club._schema);

// Renders the Club Table in the Management tab. See pages/AdminManage.jsx.
const ClubTable = ({ club, faculty, eventKey }) => {
  const [show, setShow] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(club.advisor);
  const [rioList, setRioList] = useState(club.rio);

  // on change, update the advisor state
  const handleChangeAdvisor = (option) => {
    setSelectedAdvisor(option);
  };

  // on change, update the rio state
  const handleChangeRioList = (list) => {
    setRioList(list);
  };

  // format advisors for react-select field
  const clubAdvisors = club.advisor.map(e => ({
    label: `${e}`,
    value: `${e}`,
  }));

  // format faculty for react-select field
  const facultyList = faculty.map(e => ({
    label: `${e.firstName} ${e.lastName}`,
    value: `${e.firstName} ${e.lastName}`,
  }));

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

  // on form submit, edit the club information
  const submit = (data) => {
    const { clubName, website, image, description, advisor } = data;
    const collectionName = Club.getCollectionName();
    // convert advisor to an array
    let advisorArray = (advisor.includes(',') ? advisor.replace(/\s+/g, '').split(',') : advisor);
    advisorArray = selectedAdvisor.map(e => e.value);
    const updateData = { id: club._id, clubName, website, image, description, rio: rioList, advisor: advisorArray };
    // edit the Club Collection
    updateMethod.callPromise({ collectionName, updateData }).catch((err) => swal('Error', err.message, 'error'))
      .then(() => swal('Success', 'Club edited successfully', 'success'));
  };

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${club.clubName}`}</Col>
          <Col>{`${club.advisor.join(', ')}`}</Col>
          <Col xs={2}>
            <Row>
              <Col style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={() => { setShow(true); setSelectedAdvisor(clubAdvisors); }}>Edit</Button></Col>
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
                  <Col>
                    <span>Rio Officers</span>
                    <TagsInput name="rio" value={rioList} onChange={handleChangeRioList} inputProps={{ className: 'react-tagsinput-input', placeholder: 'Add an Officer......' }} />
                  </Col>
                </Row>
                <Row className="py-3">
                  <TextField hidden name="rio" placeholder="Rio Officers" help="Please separate names using commas." />
                  <span>Club Advisor</span>
                  <Select name="advisor" closeMenOnSelect={false} isMulti options={facultyList} defaultValue={selectedAdvisor} onChange={handleChangeAdvisor} help="Please select at least 1 advisor." />
                </Row>
                <Row>
                  <SubmitField value="Submit" disabled={!(selectedAdvisor.length > 0)} />
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

// Require a document to be passed to this component.
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
  faculty: PropTypes.arrayOf(Object).isRequired,
};

export default ClubTable;
