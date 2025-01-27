import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { url } from '../../../../../backendapi';

export default function MyContent() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      async function fetchUserData() {
        try {
          const response = await fetch(`${url}/user/${userId}`);
          if (!response.ok) throw new Error('User not found.');
          const data = await response.json();
          setUserData(data);
          setFormData({
            fullName: data.fullName,
            email: data.email,
            password: ''
          });
        } catch (err) {
          setError(err.message);
        }
      }

      fetchUserData();
    } else {
      setError('No user ID found in local storage.');
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = formData;

    try {
      const response = await fetch(`${url}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, fullName, email, password }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setUserData((prevData) => ({
        ...prevData,
        fullName,
        email,
      }));

      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/logout`, {
        method: 'POST',
        credentials: 'include', // Ensure the session cookie is sent
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear all local storage items relevant to the user
      localStorage.removeItem('userId');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('cartItems'); // If any cart-related items are stored
      localStorage.removeItem('userToken'); // If you store any token

      // Redirect after successful logout
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg rounded-3">
            <Card.Body>
              {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formFullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  {error && <p className="text-danger">{error}</p>}

                  <Button variant="primary" type="submit" size="lg" className="mt-3">
                    Update Profile
                  </Button>
                </Form>
              ) : (
                <>
                  <h3 className="text-center mb-3">
                    Name: {userData ? userData.fullName : 'Loading...'}
                  </h3>
                  <h3 className="text-center text-muted">
                    Email: {userData ? userData.email : 'Loading email...'}
                  </h3>
                  <div className="d-flex justify-content-center mt-4">
                    <Button variant="primary" size="lg" className="mr-2" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                    <Button variant="secondary" size="lg" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}