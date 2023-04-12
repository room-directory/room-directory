import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/* A simple static component to render some text for the landing page. */

const Landing = () => {
  const [currentSentence, setCurrentSentence] = useState('');

  useEffect(() => {
    const sentence = 'Welcome to the ICS Room Directory! \n Creating a user friendly interface for office space management of the ICS department.';
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
