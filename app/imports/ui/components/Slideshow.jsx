import React from 'react';
import { Container, Carousel } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Slideshow component. Used in landing page. */
const Slideshow = () => (
  <Container fluid id={PAGE_IDS.LANDING} className="py-3 m-0 p-0 pt-0 w-100">
    <Carousel data-interval="943" touch="true" className="w-100">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/chair.gif"
          height="150px"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3 className="text-primary text-bg-dark">First</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/chair.gif"
          height="150px"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/meteor-logo.png"
          height="150px"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h1>Top text</h1>
          <h3>Third</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </Container>
);
export default Slideshow;
