import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ROLE } from '../../api/role/Role';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);
  const topMenuStyle = { color: 'white' };
  const bottomMenuStyle = { marginBottom: '10px', border: '1px solid black' };
  return (
    <nav>
      <Navbar bg="light" expand="lg" style={topMenuStyle}>
        <Container>
          <Navbar.Brand id={COMPONENT_IDS.NAVBAR_LANDING_PAGE} as={NavLink} to="/" className="text-white"><img alt="" src="/images/ICS-Logo.png" width="40" height="40" /* className="d-inline-block align-top" */ />Room Directory</Navbar.Brand>
          <Navbar.Toggle aria-controls={COMPONENT_IDS.NAVBAR_COLLAPSE} />
          <Navbar.Collapse id={COMPONENT_IDS.NAVBAR_COLLAPSE}>
            <Nav className="me-auto justify-content-start" />
            <Nav className="justify-content-end text-white">
              {currentUser === '' ? (
                <NavDropdown id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN} title="Login" className="text-white">
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_IN} as={NavLink} to="/signin"><PersonFill />Sign in</NavDropdown.Item>
                  <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_LOGIN_DROPDOWN_SIGN_UP} as={NavLink} to="/signup"><PersonPlusFill />Sign up</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown id={COMPONENT_IDS.NAVBAR_CURRENT_USER} title={currentUser}>
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
              <Nav.Link id={COMPONENT_IDS.NAVBAR_FACULTY_INFORMATION} as={NavLink} to="/" key="Faculty">Faculty Information</Nav.Link>
              {currentUser ? ([
                <Nav.Link id={COMPONENT_IDS.NAVBAR_ADD_STUFF} as={NavLink} to="/add" key="add">Room List</Nav.Link>,
                <Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_STUFF} as={NavLink} to="/list" key="list">Room Reservation</Nav.Link>,
              ]) : ''}
              {Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN]) ? (
                /* [<Nav.Link id={COMPONENT_IDS.NAVBAR_LIST_STUFF_ADMIN} as={NavLink} to="/admin" key="admin">Admin</Nav.Link>,
                  <NavDropdown id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN} title="Manage" key="manage-dropdown">
                    <NavDropdown.Item id={COMPONENT_IDS.NAVBAR_MANAGE_DROPDOWN_DATABASE} key="manage-database" as={NavLink} to="/manage-database"><CloudDownload /> Database</NavDropdown.Item>
                  </NavDropdown>] */
                <Nav.Link id={COMPONENT_IDS.NAVBAR_STUDENT_REQUESTS} as={NavLink} to="/" key="requests">Student Requests</Nav.Link>
              ) : ''}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </nav>
  );
};

export default NavBar;
