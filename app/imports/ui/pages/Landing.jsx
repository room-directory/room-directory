import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* A simple static component to render some text for the landing page. */
const sentences = [
  'Creating a user friendly interface for office space management of the ICS department.',
  'Welcome to the ICS Room Directory!',
];
const Landing = () => {
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < sentences[currentSentenceIndex].length) {
        const next = sentences[currentSentenceIndex][currentIndex];
        setCurrentSentence((prev) => prev + next);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
        setCurrentSentence('');
        setCurrentSentenceIndex((prev) => (prev === sentences.length - 1 ? 0 : prev + 1));
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [currentIndex, currentSentenceIndex]);
  return (
    <Container
      fluid
      id={PAGE_IDS.LANDING}
      className="p-0 m-0"
      style={{
        backgroundImage: "url('../images/post.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundClip: 'padding-box',
        maxHeight: '565px',
      }}
    >
      <Row style={{ marginTop: '200px', marginBottom: '90%' }}>
        <Col className="d-flex justify-content-start align-items-center" md={{ span: 4, offset: 1 }}>
          <div className="text-center text-white text-opacity-100 cont">
            <p>{currentSentence}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
