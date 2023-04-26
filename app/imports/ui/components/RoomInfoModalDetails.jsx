import React from 'react';
import PropTypes from 'prop-types';

/** The RoomInfoModalSVG appears at the bottom of the Room List page. */
const RoomInfoModalDetails = ({ details }) => (
  <tr>
    <td>
      #{details.number}
    </td>
    <td>
      ({details.location})
    </td>
  </tr>
);

RoomInfoModalDetails.propTypes = {
  details: PropTypes.shape({
    number: PropTypes.string,
    location: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default RoomInfoModalDetails;
