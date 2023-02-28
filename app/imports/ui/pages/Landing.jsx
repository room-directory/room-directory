import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TypeWriterEffect from 'react-typewriter-effect';
import { PAGE_IDS } from '../utilities/PageIDs';

/* A simple static component to render some text for the landing page. */

const Landing = () => (
  <Container
    fluid
    id={PAGE_IDS.LANDING}
    className="p-0 m-0"
    style={{
      height: '65vh',
      backgroundImage: "url('../images/post.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <Row style={{ marginTop: '200px', marginBottom: '80%' }}>
      <Col className="d-flex justify-content-start align-items-center" md={{ span: 4, offset: 2 }}>
        <div className="text-center text-white text-opacity-100 cont">
          <TypeWriterEffect
            startDelay={200}
            cursorColor="#3F3D56"
            multiText={[
              'Creating a user friendly interface for office space management of the ICS department',
            ]}
            multiTextDelay={100}
            typeSpeed={50}
          />
        </div>
      </Col>

    </Row>

  </Container>
);

export default Landing;
