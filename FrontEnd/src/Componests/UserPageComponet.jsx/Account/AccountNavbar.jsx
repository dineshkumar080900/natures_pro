// Accountsidemenubar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaUser, FaMapMarkerAlt, FaBox, FaLock } from 'react-icons/fa'; // Add icons

const Accountsidemenubar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link href="/my_profile">
          <FaUser className="me-2" /> My Profile
        </Nav.Link>
        <Nav.Link href="/delivery_address">
          <FaMapMarkerAlt className="me-2" /> Delivery Address
        </Nav.Link>
        <Nav.Link href="/my_orders">
          <FaBox className="me-2" /> My Orders
        </Nav.Link>
        <Nav.Link href="/change_password">
          <FaLock className="me-2" /> Change Password
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Accountsidemenubar;