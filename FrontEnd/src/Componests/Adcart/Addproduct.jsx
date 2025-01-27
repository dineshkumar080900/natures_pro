import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Container, Row, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import NavbarAdmin from '../Adminmaincompoments/Adminnavbar/Navabaradmin';
import Sidebar from './sidebar';
import { url } from '../../backendapi';

const AddProduct = () => {
  const [previewUrls, setPreviewUrls] = useState([null, null, null, null, null, null]);
  const [images, setImages] = useState([]); // Store the selected images
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  // Fetch product types on component mount
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch(`${url}/admin/getProductTypes`);
        const data = await response.json();
        setProductTypes(data);
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };
    fetchProductTypes();
  }, []);

  // Handle image change and preview
  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls[index] = URL.createObjectURL(file);
      setPreviewUrls(newPreviewUrls);

      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    
    // Extract form data
    const formFields = {
      name: event.target.name.value,
      description: event.target.description.value,
      totalPrice: event.target.totalPrice.value,
      option: event.target.option.value,
      offerPrice: event.target.offerPrice.value,
      productDetails: event.target.productDetails.value,
      productcount: event.target.productcount.value,
      rating: event.target.rating.value,
    };

    // Append form fields to FormData
    Object.keys(formFields).forEach((key) => {
      formData.append(key, formFields[key]);
    });

    // Append images to FormData
    images.forEach((image, index) => {
      if (image) {
        formData.append('images', image);
      }
    });

    // Validate that at least one image is selected
    if (images.length === 0 || images.some((image) => !image)) {
      setErrorMessage('Please select all images before submitting.');
      setIsLoading(false);
      return;
    }

    // Submit form data
    try {
      const response = await axios.post(`${url}/admin/addproduct`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product added successfully:', response.data);
      setSuccessMessage('Product added successfully!');
      setShowModal(true);

      // Hide modal after 1 second and clear form
      setTimeout(() => {
        setShowModal(false);
        clearForm();
      }, 1000);
    } catch (error) {
      console.error('Failed to add product:', error);
      setErrorMessage('Error adding product. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form and reset state
  const clearForm = () => {
    setPreviewUrls([null, null, null, null, null, null]);
    setImages([]);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(false);

    // Reset form fields
    document.getElementById('productForm').reset();
  };

  return (
    <Container fluid className="p-0" style={{ overflow: 'hidden' }}>
      <NavbarAdmin />
      <Row>
        <Col lg={3} className="d-lg-block d-none">
          <Sidebar />
        </Col>
        <Col lg={9}>
          <Container className="mt-4">
            <h1>Add Product</h1>
            <hr />

            {/* Show Success Message */}
            {successMessage && (
              <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                {successMessage}
              </Alert>
            )}

            {/* Show Error Message */}
            {errorMessage && (
              <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                {errorMessage}
              </Alert>
            )}

            <form id="productForm" onSubmit={handleSubmit}>
              <Row>
                <Col lg={4}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Product Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Name"
                      required
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Product Description</label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      className="form-control"
                      placeholder="Enter Product Description"
                      required
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <label htmlFor="totalPrice" className="form-label">Product Total Price</label>
                    <input
                      id="totalPrice"
                      name="totalPrice"
                      type="number"
                      className="form-control"
                      placeholder="Enter Total Price"
                      required
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <label htmlFor="option" className="form-label">Product Type</label>
                  <select className="form-select" name="option" required>
                    {productTypes.map((type) => (
                      <option key={type.producttype} value={type.producttype}>
                        {type.producttype}
                      </option>
                    ))}
                  </select>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <label htmlFor="productcount" className="form-label">Product Count</label>
                    <input
                      id="productcount"
                      name="productcount"
                      type="number"
                      className="form-control"
                      placeholder="Enter Count"
                      required
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-3">
                    <label htmlFor="offerPrice" className="form-label">Product Offer Price</label>
                    <input
                      id="offerPrice"
                      name="offerPrice"
                      type="number"
                      className="form-control"
                      placeholder="Enter Offer Price" 
                      required
                    />
                  </div>
                </Col>
                
                <Col lg={3}>
                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Product Rating</label>
                    <input
                      id="rating"
                      name="rating"
                      type="number"
                      className="form-control"
                      placeholder="Enter Product Rating"
                      required
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="productDetails" className="form-label">Product Details</label>
                    <textarea
                      id="productDetails"
                      name="productDetails"
                      className="form-control"
                      rows="3"
                      placeholder="Enter Product Details"
                      required
                    />
                  </div>
                </Col>
              </Row>

              {/* Image Upload Section */}
              <Row>
                {Array(6).fill().map((_, index) => (
                  <Col lg={4} key={index}>
                    <label>{`Product Image ${index + 1}`}</label>
                    <div
                      style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        border: '1px dashed #ccc',
                        padding: '20px',
                        borderRadius: '5px',
                      }}
                      onClick={() => document.getElementById(`files${index + 1}`).click()}
                    >
                      <img
                        src={previewUrls[index] || 'https://via.placeholder.com/200x100?text=Preview'}
                        alt="Preview"
                        style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }}
                      />
                      <p>Click to upload an image</p>
                    </div>
                    <input
                      id={`files${index + 1}`}
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={(event) => handleImageChange(event, index)}
                    />
                  </Col>
                ))}
              </Row>

              {/* Submit Button */}
              <Button variant="primary" type="submit" className="mt-3">
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
          </Container>

          {/* Success Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Success</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Product added successfully!</p>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;