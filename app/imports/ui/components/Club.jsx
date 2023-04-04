import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';

/** Renders a single row in the Club Information table. See pages/ClubInfo.jsx. */
const Club = ({ club }) => {
  const [showMore, setShowMore] = useState(false);
  // const [isFlipped, setIsFlipped] = useState(false);
  /** To DO: Fix Flip function */
  // const handleClick = () => {
  //   setIsFlipped(!isFlipped);
  // };
  // const { desc } = club.description;
  return (
    // <div className="flip-card">
    //   <div className={isFlipped ? 'flip-card-inner flipped' : 'flip-card-inner'} onClick={handleClick}>
    <Card className="listing d-flex justify-content-centert">
      <Card.Body style={{ alignContent: 'center' }}>
        <div>
          <a href={club.website} target="_blank" rel="noopener noreferrer" style={{ alignContent: 'center' }}><img alt="Club logo" src={club.image} width="180" height="180" /></a>
        </div>
        <div className="ms-3 align-content-center">
          <p className="fw-bold mb-1 text-center">{club.clubName}</p>
          <p className="text-muted mb-0">
            {showMore ? club.description : `${club.description.substring(0, 100)}`}
            <Button size="sm" variant="link" className="btn" onClick={() => setShowMore(!showMore)}>{showMore ? 'Read less' : 'Read more'}
            </Button>
          </p>
        </div>
        <Button variant="primary">More Info</Button>
      </Card.Body>
    </Card>
  // <Card onClick={handleClick} className="listing d-flex justify-content-center flip-card-back">
  //   <Card.Body style={{ alignContent: 'center' }}>
  //     <div>
  //       <a href={club.website} target="_blank" rel="noopener noreferrer" style={{ alignContent: 'center' }}><img alt="Club logo" src={club.image} width="180" height="180" /></a>
  //     </div>
  //     <div className="ms-3 align-content-center">
  //       <p className="fw-bold mb-1 text-center">{club.clubName}</p>
  //       <div>
  //         {/* <Table> */}
  //         {/*  <thead> */}
  //         {/*    <tr> */}
  //         {/*      <th> </th> */}
  //         {/*      <th>RIO Student(s)</th> */}
  //         {/*      <th>Advisor(s)</th> */}
  //         {/*    </tr> */}
  //         {/*  </thead> */}
  //         {/*  <tbody> */}
  //         {/*    <tr> */}
  //         {/*      <th /> */}
  //         {/*      <td>{club.rio}</td> */}
  //         {/*      <td>{club.advisor}</td> */}
  //         {/*    </tr> */}
  //         {/*  </tbody> */}
  //         {/* </Table> */}
  //       </div>
  //     </div>
  //     <Button variant="primary">More Info</Button>
  //   </Card.Body>
  // </Card>
  //     </div>
  //   </div>
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
