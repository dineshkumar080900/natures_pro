import React, { useState, useEffect } from 'react';  // Import necessary hooks
import axios from 'axios';  // Import axios for making HTTP requests
import Navabaradmin from '../Adminmaincompoments/Adminnavbar/Navabaradmin';
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from '../Adminmaincompoments/sidebar';

// UserProfile Component
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);  // State to store user data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make the GET request to fetch the user by ID
        const response = await axios.get(`http://localhost:8080/admin/user/${userId}`);

        // Set user data into state
        setUser(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        setError('Failed to fetch user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]); // Only run this effect when userId changes

  // Display loading, error, or user data
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User ID:</strong> {user.userId}</p>
      {/* You can add more fields here as needed */}
    </>
  );
};

// Main userDetailsPage Component
export default function UserDetailspage() {
  const userId = "60d21b4667d0d8992e610c85"; // Replace with the actual user ID from your context or props

  return (
    <>
      <Navabaradmin />

      <Container fluid className="p-0" style={{ overflow: 'hidden' }}>
        <Row>
          {/* Sidebar */}
          <Col lg={3} className="d-none d-lg-flex">
            <Sidebar style={{ height: "100%" }} />
          </Col>
          <Col>
            {/* Render the UserProfile Component */}
            <UserProfile userId={userId} />
          </Col>
        </Row>
      </Container>
    </>
  );
}