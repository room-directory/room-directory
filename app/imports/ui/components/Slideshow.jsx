import React from 'react';
import { Carousel } from 'react-bootstrap';

/** Slideshow component. Used in landing page. */
const Slideshow = () => (
  <Carousel data-interval="943" touch="true">
    <Carousel.Item>
      <img
        className="d-block w-100"
        src="/images/chair.gif"
        height="400"
        alt="First slide"
      />
      <Carousel.Caption>
        <h3 className="text-primary">First</h3>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <img
        className="d-block w-100"
        src="/images/chair.gif"
        height="400"
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
        height="400"
        alt="Third slide"
      />

      <Carousel.Caption>
        <h1>Top text</h1>
        <h3>Third</h3>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
);
export default Slideshow;
