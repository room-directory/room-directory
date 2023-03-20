import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { Club } from '../../api/club/ClubCollection';

const ClubTable = ({ club, eventKey }) => {
  const [setShow] = useState(false);

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
