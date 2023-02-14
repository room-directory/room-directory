import React from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';

const ProfileTable = ({ account, eventKey }) => {

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

  return (
    <Card style={{ border: 'none', borderRadius: 0 }}>
      <Card.Header style={eventKey % 2 === 0 ? { backgroundColor: 'whitesmoke', border: 'none' } : { backgroundColor: '#fbfbfb', border: 'none' }}>
        <Row>
          <Col>{`${account.lastName}`}</Col>
          <Col>{`${account.firstName}`}</Col>
          <Col>{account.email}</Col>
          <Col>{account.position}</Col>
          <Col xs={1}><Button variant="primary">Edit</Button></Col>
          <Col xs={1}><Button variant="danger" onClick={del}>Delete</Button></Col>
        </Row>
      </Card.Header>
    </Card>
  );
};

/* Referencing the Base Collection */
ProfileTable.propTypes = {
  account: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    position: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  eventKey: PropTypes.string.isRequired,
};

export default ProfileTable;
