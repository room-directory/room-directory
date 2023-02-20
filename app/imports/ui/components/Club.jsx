import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the Club Information table. See pages/ClubInfo.jsx. */
const Club = ({ club }) => (
  <tr>
    <td>{club.clubName}</td>
    <td><ul>{club.rio.map((student) => <li>{student}</li>)}</ul></td>
    <td><ul>{club.advisor.map((faculty) => <li>{faculty}</li>)}</ul></td>
  </tr>
);

// Require a document to be passed to this component.
Club.propTypes = {
  club: PropTypes.shape({
    clubName: PropTypes.string,
    rio: PropTypes.arrayOf(PropTypes.string),
    advisor: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
};

export default Club;
