import React from 'react';
import swal from 'sweetalert';
import { Col, Container, Image, Row, Button, InputGroup, Form, Dropdown } from 'react-bootstrap';
import { useParams } from 'react-router';
import { Roles } from 'meteor/alanning:roles';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { ROLE } from '../../api/role/Role';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/* TODO: Implement Edit profile, review user profile subscription (currently getting all profiles) */
const EditProfile = () => {

  const { _id } = useParams();
  let pfp;
  let updateData;

  const { ready, user } = useTracker(() => {
    // Get access to Reservations and User Profile documents.
    const profileSubscription = UserProfiles.subscribe();
    const adminProfileSubscription = AdminProfiles.subscribe();
    // Determine if the subscriptions are ready
    const rdy1 = adminProfileSubscription.ready();
    const rdy2 = profileSubscription.ready();
    const rdy = rdy1 && rdy2;
    // Get the Reservations and User Profile documents
    let usr = UserProfiles.findOne({ _id: _id }, {});
    if (usr === undefined) usr = AdminProfiles.findOne({ _id: _id }, {});
    return {
      user: usr,
      ready: rdy,
    };
  }, [_id]);
  const submit = () => {
    const uploadImage = document.getElementById('uploadImage').files[0];
    const fName = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_FORM_FIRST_NAME).value.toString();
    const lName = document.getElementById(COMPONENT_IDS.EDIT_PROFILE_FORM_LAST_NAME).value.toString();
    let collectionName;
    if (Roles.userIsInRole(Meteor.userId(), [ROLE.USER])) {
      collectionName = UserProfiles.getCollectionName();
    } else {
      collectionName = AdminProfiles.getCollectionName();
    }
    if (uploadImage) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadImage);
      reader.onloadend = () => {
        pfp = reader.result;
        updateData = { id: user._id, firstName: fName, lastName: lName, image: pfp };
        updateMethod.callPromise({ collectionName, updateData })
          .catch(error => swal('Error', error.message, 'error'))
          .then(() => swal('Success', 'Profile updated successfully', 'success'));
      };
    } else {
      updateData = { id: user._id, firstName: fName, lastName: lName, image: pfp };
      updateMethod.callPromise({ collectionName, updateData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => swal('Success', 'Profile updated successfully', 'success'));
    }

  };

  const pfpUpdate = (src) => {
    pfp = src;
  };

  return (ready ? (
    <Container id={PAGE_IDS.PROFILE} className="py-3">
      <Row>
        <Col>
          <h1 className="montserrat" style={{ textAlign: 'center', fontSize: '2em' }}>Edit Profile</h1>
        </Col>
      </Row>
      <Row className="justify-content-center pb-4">
        <Col style={{ textAlign: 'center' }}>
          <Row className="justify-content-center pb-4">
            <Image id="profile-image" roundedCircle className="h-25 w-25" src={user.image} />
          </Row>
          <Row className="justify-content-md-center pb-4">
            <Dropdown drop="up-centered" onSelect={pfpUpdate}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Choose Default Profile Picture
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="/images/case.png"><Image roundedCircle height={50} width={50} src="/images/case.png" /> PFP 1</Dropdown.Item>
                <Dropdown.Item eventKey="/images/keyboard.png"><Image roundedCircle height={50} width={50} src="/images/keyboard.png" /> PFP 2</Dropdown.Item>
                <Dropdown.Item eventKey="/images/monitor.png"><Image roundedCircle height={50} width={50} src="/images/monitor.png" /> PFP 3</Dropdown.Item>
                <Dropdown.Item eventKey="/images/mouse.jpg"><Image roundedCircle height={50} width={50} src="/images/mouse.jpg" /> PFP 4</Dropdown.Item>
                <Dropdown.Item eventKey="/images/speaker.png"><Image roundedCircle height={50} width={50} src="/images/speaker.png" /> PFP 5</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Row className="justify-content-center pb-4">
            <InputGroup size="sm">
              <Form.Control id="uploadImage" type="file" name="profilePicture" accept="image/*" optional="true" />
            </InputGroup>
          </Row>
        </Col>
        <Col sm={1} />
        <Col>
          <Row>
            <h2 id="profile-name" style={{ textTransform: 'uppercase' }}>{`${user.firstName} ${user.lastName}`}</h2>
          </Row>
          <Row>
            {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
              <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>ADMIN</h4>
            ) :
              <h4 id="profile-role" style={{ textTransform: 'uppercase' }}>{`${user.position}`}</h4>}
          </Row>
          <Row />
          <Row className="p-3">
            <Col>
              <InputGroup size="sm">
                <InputGroup.Text><b>First Name</b></InputGroup.Text>
                <Form.Control id={COMPONENT_IDS.EDIT_PROFILE_FORM_FIRST_NAME} defaultValue={user.firstName ? user.firstName : ''} />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup size="sm">
                <InputGroup.Text><b>Last Name</b></InputGroup.Text>
                <Form.Control id={COMPONENT_IDS.EDIT_PROFILE_FORM_LAST_NAME} defaultValue={user.lastName ? user.lastName : ''} />
              </InputGroup>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: 'center' }}>
          <Button variant="outline-secondary" href={`/profile/${_id}`}>Return to Profile</Button>
          <Button variant="success" onClick={submit}>Save</Button>
        </Col>
      </Row>
    </Container>
  ) :
    <LoadingSpinner message="Loading Profile" />
  );
};

export default EditProfile;
