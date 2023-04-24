import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* A simple static component to render some text for the landing page. */

const Landing = () => {
  const [currentSentence, setCurrentSentence] = useState('');

  useEffect(() => {
    const sentence = 'Welcome to ICS Room Directory! \n' +
        ' An interactive and user friendly app for office space management of the ICS department.';
    let currentIndex = 0;
    let timeoutId = null;

    const typeNextChar = () => {
      const nextChar = sentence[currentIndex];
      setCurrentSentence((prev) => prev + nextChar);
      currentIndex++;
      if (currentIndex === sentence.length) {
        clearTimeout(timeoutId);
      } else {
        timeoutId = setTimeout(typeNextChar, 50); // Change this value to adjust the typing speed
      }
    };

    timeoutId = setTimeout(typeNextChar, 50); // Start typing

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Container
      fluid
      id={PAGE_IDS.LANDING}
      className="p-0 m-0 overflow-hidden"
      style={{
        backgroundImage: "url('../images/post.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundClip: 'padding-box',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        height: '100%',
        zIndex: '-1',
        position: 'absolute',
      }}
    >
      <Row style={{ marginTop: '150px', marginBottom: '35vh' }}>
        <Col className="d-flex justify-content-start align-items-center">
          <Card className="p-5 text-center land-card" style={{ backgroundColor: 'rgba(0, 63, 24, 0.70)', width: '50%', height: '25vh', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', fontSize: '1em' }}>
            <p className="text-white cont flex-column" style={{ fontSize: 'calc(1.2vw + 0.8vh', alignItems: 'center' }}>{currentSentence}</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
