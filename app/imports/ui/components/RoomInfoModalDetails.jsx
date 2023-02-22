import React from 'react';
import PropTypes from 'prop-types';

/** The RoomInfoModalSVG appears at the bottom of the Room List page. */
const RoomInfoModalDetails = ({ details }) => (
  <tr>
    <th scope="row"> </th>
    <td className="ps-3">
      #{details.number}
    </td>
    <td className="ps-1">
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
