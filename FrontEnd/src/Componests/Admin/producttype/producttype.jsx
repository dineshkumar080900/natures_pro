import React, { useState } from 'react';
import { Col, Container, Row, FormControl, Button, Alert } from 'react-bootstrap';
import Navabaradmin from '../Adminmaincompoments/Adminnavbar/Navabaradmin';
import Sidebar from '../Adminmaincompoments/sidebar';
import axios from 'axios';
import { url } from '../../../backendapi';

const ProductTypeInElement = () => {
  const [productType, setProductType] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Handle input field change
  const handleInputChange = (e) => {
    setProductType(e.target.value);
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate product type
    if (!productType.trim()) {
      setMessage('Product Type is required!');
      setMessageType('error');
      return;
    }

    try {
      // Make POST request to the backend to add product type
      const response = await axios.post(`${url}/admin/addProductType`, { producttype: productType });

      if (response.status === 201) {
        setMessage('Product Type added successfully!');
        setMessageType('success');
      } else {
        setMessage('Error adding product type!');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding product type!');
      setMessageType('error');
    } finally {
      // Reset form input after submission
      setProductType('');
    }
  };

  return (
    <Container fluid className="p-0">
      <Navabaradmin />
      <Row>
        <Col lg={3} className="d-lg-block d-none">
          <Sidebar />
        </Col>
        <Col lg={9}>
          <Container className="mt-4">
            <h1>Add Product Type</h1>
            <hr />
            <form onSubmit={handleFormSubmit}>
              <Row>
                <Col lg={6} xs={12}>
                  <div className="form-group">
                    <label htmlFor="productType" className="fw-bold">Product Type</label>
                    <FormControl
                      type="text"
                      name="productType"
                      id="productType"
                      value={productType}
                      onChange={handleInputChange}
                      placeholder="Enter Product Type"
                      style={{ height: '50px', width: '100%' }}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={6} xs={12}>
                  <Button variant="danger" type="submit" style={{ padding: '10px 20px' }}>
                    Add Product Type
                  </Button>
                </Col>
              </Row>
            </form>
            {message && (
              <Alert variant={messageType === 'success' ? 'success' : 'danger'} className="mt-3">
                {message}
              </Alert>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductTypeInElement;