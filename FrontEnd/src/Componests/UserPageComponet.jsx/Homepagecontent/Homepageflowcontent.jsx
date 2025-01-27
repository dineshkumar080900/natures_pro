import React from 'react';
import Marquee from 'react-fast-marquee';
import { Container, Row, Col } from 'react-bootstrap';
import Compothead from './Marqueecontent'; // Ensure this file exports a valid React component

export default function Homepageflowcontent() {
  return (
    <Container fluid className="p-0">
      {/* Row for Marquee content */}
      <Row className="m-0">
        <Col xs={12} className="p-0">
          {/* Marquee Component */}
          <Marquee>
            <Compothead />
          </Marquee>
        </Col>
      </Row>
    </Container>
  );
}