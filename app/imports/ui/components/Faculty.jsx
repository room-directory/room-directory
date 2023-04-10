import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the Faculty Information table. See pages/FacultyInfo.jsx. */
const Faculty = ({ faculty, user }) => (
  <tr>
    <td><img alt="" src={faculty.image} width="180" height="180" /></td>
    <td>{`${faculty.firstName} ${faculty.lastName}`}<br />{faculty.role} {faculty.role.map((role) => <div>{role}</div>)}</td>
    <td>{faculty.email} {faculty.phone.map((phone) => <div>{phone}</div>)}</td>
    <td>{faculty.officeLocation.map((office) => <div>{office}</div>)}</td>
    { user !== '' ?
      ([
        <td>{faculty.officeHours}</td>,
      ])
      : ''}
  </tr>
);

// Require a document to be passed to this component.
Faculty.propTypes = {
  faculty: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    image: PropTypes.string,
    role: PropTypes.arrayOf(PropTypes.string),
    officeLocation: PropTypes.arrayOf(PropTypes.string),
    officeHours: PropTypes.string,
    phone: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  user: PropTypes.string.isRequired,
};

export default Faculty;
