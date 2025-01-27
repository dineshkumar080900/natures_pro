import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navabaradmin from './Adminmaincompoments/Adminnavbar/Navabaradmin';
import { Col, Row, Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from './Adminmaincompoments/sidebar';
import { url } from '../../backendapi';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/admin/getproduct`);
        setProducts(response.data.products);
      } catch (error) {
        setErrorMessage('Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle product edit
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setUpdatedDetails({
      ...product,
      images: [...product.images],
      productcount: product.productcount || 0,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handleImageChange = (index, file) => {
    const updatedImages = [...updatedDetails.images];
    updatedImages[index] = file;
    setUpdatedDetails({ ...updatedDetails, images: updatedImages });
  };

  // Handle delete confirmation modal
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`${url}/admin/productdeleteapi/${productToDelete}`);
        setProducts(products.filter((product) => product._id !== productToDelete));
      } catch (error) {
        setErrorMessage('Failed to delete product.');
      } finally {
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  // Handle product update
  const handleUpdateProduct = async () => {
    const formData = new FormData();
    Object.keys(updatedDetails).forEach((key) => {
      if (key !== 'images') formData.append(key, updatedDetails[key]);
    });

    updatedDetails.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append('images', image);
      } else {
        formData.append(`existingImages[${index}]`, image);
      }
    });

    try {
      const response = await axios.put(
        `${url}/admin/updateproduct/${currentProduct._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === response.data.product._id ? response.data.product : product
          )
        );
        setShowModal(false);
      }
    } catch (error) {
      setErrorMessage('Failed to update product.');
    }
  };

  return (
    <>
      <Navabaradmin />
      <Container fluid>
        <Row>
          <Col lg={3} className="d-none d-lg-flex p-0">
            <Sidebar />
          </Col>
          <Col lg={9}>
            <Container className="mt-4">
              <h1>Product List</h1>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              <Table striped responsive bordered hover>
                <thead>
                  <tr>
                    <th>Product Count</th>
                    <th>Name</th>
                    <th>Total Price</th>
                    <th>Product Type</th>
                    <th>Image</th>
                    <th>Actions</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center">Loading...</td>
                    </tr>
                  ) : (
                    products.map((product,index) => (
                      <tr key={product._id}>
                        <td>{index+1}</td>
                        <td>{product.name}</td>
                        <td>${product.totalPrice}</td>
                        <td>{product.option}</td>
                        <td>
                          <img
                            src={`${url}/image_product/${product.images[0]}`}
                            alt="Product"
                            style={{ width: '100px' }}
                          />
                        </td>
                        <td>
                          <Button variant="info" onClick={() => handleEdit(product)}>Edit</Button>{' '}
                          <Button variant="danger" onClick={() => handleDeleteClick(product._id)}>Delete</Button>
                        </td>
                        <td>{product.rating}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Container>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      {currentProduct && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={updatedDetails.name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={updatedDetails.description || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Product Count</Form.Label>
                <Form.Control
                  type="number"
                  name="productcount"
                  value={updatedDetails.productcount || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {updatedDetails.images.map((image, index) => (
                <Form.Group key={index} className="mb-3">
                  <Form.Label>Image {index + 1}</Form.Label>
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : `http://localhost:8080/image_product/${image}`
                      }
                      alt="Product"
                      style={{ width: '100px', marginRight: '10px' }}
                    />
                    <Form.Control
                      type="file"
                      onChange={(e) => handleImageChange(index, e.target.files[0])}
                    />
                  </div>
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateProduct}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}