import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the Faculty Information table. See pages/FacultyInfo.jsx. */
const Faculty = ({ faculty }) => (
  <tr>
    <td><img alt="" src={faculty.image} width="180" height="180" /></td>
    <td>{`${faculty.firstName} ${faculty.lastName}`}<br />{faculty.role}</td>
    <td>{faculty.email}<br />{faculty.phone}</td>
    <td>{faculty.officeLocation}</td>
  </tr>
);

// Require a document to be passed to this component.
Faculty.propTypes = {
  faculty: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    image: PropTypes.string,
    role: PropTypes.string,
    officeLocation: PropTypes.string,
    officeHours: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default Faculty;
