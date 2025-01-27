import React, { useState } from 'react';
import HeadTopHeading from '../../Navbarheadtop/swiperinword';
import UnifiedNavbar from '../../../Navebar/Navbardesignhomepage';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa';  // Import hamburger and close icons
import Accountsidemenubar from '../Accountsidemenubar';
import AddressForm from './Myprofilesubcontent/Addadress';

export default function Myprofile() {
  // State to control sidebar visibility on mobile
  const [showSidebar, setShowSidebar] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(prevState => !prevState);
  };

  return (
    <>
      <Container fluid className='m-0 p-0' >
        <HeadTopHeading />
        <UnifiedNavbar />

        {/* Button to toggle sidebar on mobile */}
        <Button
          className="d-md-none"  // Show the button only on mobile
          onClick={toggleSidebar}
          style={{width:'40px'}}
          aria-label="Toggle Sidebar"
        >
          {showSidebar ? <FaTimes /> : <FaBars />}
        </Button>

        <Row>
          {/* Sidebar on the left side, visible only on medium and larger screens */}
          <Col xs={12} md={3} className={`d-md-block ${showSidebar ? 'd-block' : 'd-none'}`}>
            <Accountsidemenubar />
          </Col>

          {/* Main content area */}
          <Col xs={12} md={9}>
          <AddressForm/>
          </Col>
        </Row>
      </Container>
    </>
  );
}