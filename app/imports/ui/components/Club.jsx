import React from 'react';
import PropTypes from 'prop-types';

/** Renders a single row in the Club Information table. See pages/ClubInfo.jsx. */
const Club = ({ club }) => (
  <tr>
    <td><a href={club.website} target="_blank" rel="noopener noreferrer"><img alt="Club logo" src={club.image} width="180" height="180" /></a></td>
    <td>{club.clubName}</td>
    <td>{club.description}</td>
    <td><ul>{club.rio.map((student) => <li>{student}</li>)}</ul></td>
    <td><ul>{club.advisor.map((faculty) => <li>{faculty}</li>)}</ul></td>
  </tr>
);

// Require a document to be passed to this component.
Club.propTypes = {
  club: PropTypes.shape({
    clubName: PropTypes.string,
    website: PropTypes.string,
    image: PropTypes.string,
    description: PropTypes.string,
    rio: PropTypes.arrayOf(PropTypes.string),
    advisor: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }).isRequired,
};

export default Club;
