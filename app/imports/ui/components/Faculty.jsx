import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the Faculty Information table. See pages/FacultyInfo.jsx. */
const Faculty = ({ faculty }) => (
  <tr>
    <td><img alt="" src={faculty.picture} width="180" height="180" /></td>
    <td>{`${faculty.firstName} ${faculty.lastName} \n ${faculty.role}`}</td>
    <td>{`${faculty.email}\n${faculty.phone}`}</td>
    <td>{faculty.office}</td>
  </tr>
);

// Require a document to be passed to this component.
Faculty.propTypes = {
  faculty: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    picture: PropTypes.string,
    role: PropTypes.string,
    office: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default Faculty;
