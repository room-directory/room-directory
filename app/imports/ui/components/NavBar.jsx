import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Roles } from 'meteor/alanning:roles';
import { Container, Navbar, Nav, NavDropdown, ProgressBar, Button, Col } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';

const NavBar = ({ overlay, changeOverlay, highlight, changeHighlight, counter, incrementCounter, resetCounter }) => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, user, ready } = useTracker(() => {
    const currUser = Meteor.user() ? Meteor.user().username : '';
    const userSubscription = UserProfiles.subscribe();
    const adminSubscription = AdminProfiles.subscribe();
    const rdy = adminSubscription.ready() && userSubscription.ready();
    let usr = UserProfiles.findOne({ email: currUser }, {});
    if (usr === undefined) (usr = AdminProfiles.findOne({ email: currUser }, {}));

    return {
      currentUser: currUser,
      user: usr,
      ready: rdy,
    };

  }, []);
  const topMenuStyle = { color: 'white' };
  const bottomMenuStyle = { marginBottom: '10px', border: '1px solid black' };
  const tutorialText = ['',
    'This is the faculty information page. It has information about the faculty',
    'This is the room list page where you can see a list of rooms.',
    'This page lets you see student reservation requests',
    'This page lets you see faculty reservation requests',
    'This page lets you see room reservations'];
  const location = useLocation();
  return ready ? (
    <nav>
      <Navbar bg="light" expand="lg" style={topMenuStyle}>
        <Container>
          <Navbar.Brand id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} to="/" className="text-white"><img alt="" src="/images/ICS-Logo.png" width="40" height="40" />Room Directory</Navbar.Brand>
          <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} />
          <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
            <Nav className="me-auto justify-content-start" />
            <Nav className="justify-content-end text-white">
              { currentUser === '' ? (
                <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Login" className="text-white">
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} as={NavLink} to="/signin"><PersonFill /> Sign in</NavDropdown.Item>
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} as={NavLink} to="/signup"><PersonPlusFill /> Sign up</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser}>
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_PROFILE} as={NavLink} to="/profile"><PersonFill /> Profile</NavDropdown.Item>
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_SIGN_OUT} as={NavLink} to="/signout"><BoxArrowRight /> Sign out</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar bg="white" expand="lg" style={bottomMenuStyle}>
        <Container>
          <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} />
          <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
            <Nav className="me-auto justify-content-start">
              <Nav.Link id={COMPONENT_IDS.NAVBAR_FACULTY_INFORMATION} as={NavLink} to="/faculty" key="Faculty" className={counter === 1 ? highlight : ''}>Faculty Information</Nav.Link>
              { currentUser !== '' && user?.position === 'student' ?
                (
                  <Nav.Link id={COMPONENT_IDS.NAVBAR_ROOM_LIST} as={NavLink} to="/roomlist" key="add" className={highlight}>Room List</Nav.Link>
                )
                : ''}
              { currentUser !== '' && user?.position === 'faculty' ?
                <Nav.Link id={COMPONENT_IDS.NAVBAR_STUDENT_REQUESTS} as={NavLink} to="/studentrequests" key="requests">View Student Requests</Nav.Link>
                : ''}
              { currentUser !== '' && user?.position === 'office' ?
                <Nav.Link id={COMPONENT_IDS.NAVBAR_FACULTY_REQUESTS} as={NavLink} to="/facultyrequests" key="admin">View Faculty Requests</Nav.Link>
                : ''}
              { currentUser !== '' && Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? ([
                <Nav.Link id={COMPONENT_IDS.NAVBAR_ROOM_LIST} as={NavLink} to="/roomlist" key="add" className={counter === 2 ? highlight : ''}>Room List</Nav.Link>,
                <Nav.Link id={COMPONENT_IDS.NAVBAR_STUDENT_REQUESTS} as={NavLink} to="/studentrequests" key="requests" className={counter === 3 ? highlight : ''}>View Student Requests</Nav.Link>,
                <Nav.Link id={COMPONENT_IDS.NAVBAR_FACULTY_REQUESTS} as={NavLink} to="/facultyrequests" key="admin" className={counter === 4 ? highlight : ''}>View Faculty Requests</Nav.Link>,
                <Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_STUFF} as={NavLink} to="/adminreservation" key="reservation" className={counter === 5 ? highlight : ''}>View Room Reservations</Nav.Link>,
              ])
                : ''}
            </Nav>
          </Navbar.Collapse>
          <div className="text-white h1 text-center align-content-center align-items-center d-flex" id={counter > 0 ? 'overlay' : ''}>
            <Col>{tutorialText[counter]}</Col>
          </div>
        </Container>
        {location.pathname === '/' ?
          (
            <div className="hole me-3">
              <Button type="button" variant="light" onClick={() => { changeHighlight(); incrementCounter(); }} className="position-sticky bottom-0 end-0 btn btn-outline-primary">
                {counter === 0 ? 'Tutorial' : 'Next'}
              </Button>
              {/*<Button onClick={() => { resetCounter(); changeOverlay(); }}>turn on off overlay</Button>*/}
              {/*<Button onClick={resetCounter}>Reset counter</Button>*/}
            </div>
          ) : ''}
      </Navbar>
    </nav>
  ) : <ProgressBar />;
};

NavBar.defaultProps = {
  overlay: false,
  changeOverlay: PropTypes.func,
  highlight: '',
  changeHighlight: PropTypes.func,
  counter: PropTypes.number,
  incrementCounter: PropTypes.func,
  resetCounter: PropTypes.func,

};
NavBar.propTypes = {
  overlay: PropTypes.bool,
  changeOverlay: PropTypes.func,
  highlight: PropTypes.string,
  changeHighlight: PropTypes.func,
  counter: PropTypes.number,
  incrementCounter: PropTypes.func,
  resetCounter: PropTypes.func,
};
export default NavBar;
