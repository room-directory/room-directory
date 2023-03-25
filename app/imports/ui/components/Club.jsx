import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col } from 'react-bootstrap';

/** Renders a single row in the Club Information table. See pages/ClubInfo.jsx. */
const Club = ({ club }) => {
  const [showMore, setShowMore] = useState(false);
  // const { desc } = club.description;
  return (
    <Col xl={12} lg={4} className="mb-4">
      <Card>
        <Card.Body style={{ alignContent: 'center' }}>
          <div className="d-flex align-items-center">
            <a href={club.website} target="_blank" rel="noopener noreferrer"><img alt="Club logo" src={club.image} width="180" height="180" /></a>
            <div className="ms-3">
              <p className="fw-bold mb-1">{club.clubName}</p>
              <p className="text-muted mb-0">
                {showMore ? club.description : `${club.description.substring(0, 180)}`}
                <Button size="sm" variant="link" className="btn" onClick={() => setShowMore(!showMore)}>{showMore ? 'Read less' : 'Read more'}
                </Button>
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

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
