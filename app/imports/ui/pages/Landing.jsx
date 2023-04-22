import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* A simple static component to render some text for the landing page. */

const Landing = () => {
  const [currentSentence, setCurrentSentence] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    const sentence = 'Welcome to the ICS Room Directory! \n' +
        ' Creating a user friendly interface for office space management of the ICS department.';
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
  useEffect(() => {
    if (cardRef.current) {
      const { width, height } = cardRef.current.getBoundingClientRect();
      cardRef.current.style.width = `${width}px`;
      cardRef.current.style.height = `${height}px`;
      cardRef.current.style.fontSize = `${height * 0.5}px`; // Change this value to adjust the font size
    }
  }, [currentSentence]);

  // const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  // const [currentIndex, setCurrentIndex] = useState(0);

  // const [isTyping, setIsTyping] = useState(true);
  //
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (currentIndex < sentences[currentSentenceIndex].length) {
  //       const nextChar = sentences[currentSentenceIndex][currentIndex];
  //       setCurrentSentence((prev) => prev + nextChar);
  //       setCurrentIndex((prev) => prev + 1);
  //     }
  //   }, 50); // Change this value to adjust the typing speed
  //
  //   return () => clearTimeout(timeoutId);
  // }, [currentIndex, currentSentenceIndex]);
  //
  // useEffect(() => {
  //   if (currentIndex === sentences[currentSentenceIndex].length) {
  //     setTimeout(() => {
  //       setCurrentSentence('');
  //       setCurrentIndex(0);
  //       setCurrentSentenceIndex((prev) => (prev === sentences.length - 1 ? 0 : prev + 1));
  //     }, 300); // Change this value to adjust the sentence switch speed
  //   }
  // }, [currentIndex, currentSentenceIndex]);

  return (
    <Container
      fluid
      id={PAGE_IDS.LANDING}
      className="p-0 m-0 overflow-hidden"
      style={{
        backgroundImage: "url('../images/post.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundClip: 'padding-box',
        maxHeight: '565px',
      }}
    >
      <Row style={{ marginTop: '150px', marginBottom: '40%' }}>
        <Col className="d-flex justify-content-start align-items-center">
          {/* md={{ span: 6, offset: 3 }} <div className="text-center text-white text-opacity-100 cont"> */}
          <Card ref={cardRef} className="p-5 text-center land-card" style={{ backgroundColor: 'rgba(0, 63, 24, 0.70)', position: 'relative' }}>
            <p className="text-white cont">{currentSentence}</p>
          </Card>
          {/* </div> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Landing;
