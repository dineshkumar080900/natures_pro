import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Icons for rating
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { url } from '../../../../backendapi';

const HairProduct = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null); // Track hovered product
  const [loading, setLoading] = useState(true); // Loading state

  const userId = localStorage.getItem('userId'); // Get the current user ID from localStorage (ensure user is logged in)

  // Fetch products from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${url}/admin/getproduct`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  const getRatingColor = (rating) => {
    if (rating >= 5) return 'green'; // Excellent
    if (rating >= 3) return 'orange'; // Good
    if (rating >= 2) return 'red'; // Average
    return 'red'; // Poor
  };

  // Function to add product to the cart
  const addToCart = async (productId) => {
    if (!userId) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Log In',
        text: 'You need to log in to add items to the cart.',
      });
      return;
    }

    const quantity = 1; // Default quantity for simplicity

    try {
      const response = await fetch(`${url}/addcart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      const data = await response.json();

      if (data.success) {
        Swal.fire({
          height:'100px',
          icon: 'success',
          title: 'Added to Cart!',
          text: 'The product has been successfully added to your cart.',
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the product to the cart.',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="mt-4">
      {/* Header Section */}
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2
            style={{
              fontSize: '25px',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
            }}
          >
            Hair Product
          </h2>
          <Link
            to="/products/hairproduct"
            style={{
              fontSize: '18px',
              textDecoration: 'none',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            View All
            <i
              className="fas fa-chevron-circle-right"
              style={{
                marginLeft: '8px',
                fontSize: '16px',
                transition: 'transform 0.3s',
              }}
            ></i>
          </Link>
        </Col>
      </Row>

      {/* Product Cards */}
      <Container fluid>
        <Row>
          {products.slice(0, 8).map((product) => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={product._id}>
              <div
                className="product-card"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                  padding: '10px',
                  position: 'relative',
                  height: '100%',
                }}
                onMouseEnter={() => setHoveredProductId(product._id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                {/* Stock Badge */}
                {product.stock <= 7 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: '#d2512b',
                      padding: '5px 10px',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    Only {product.stock} left
                  </span>
                )}

                {/* Product Images */}
                <div style={{ position: 'relative' }}>
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={`${url}/image_product/${product.images[0]}`}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '10px',
                        transition: '0.3s',
                        opacity: hoveredProductId === product._id ? 0 : 1,
                      }}
                    />
                    <img
                      src={`${url}/image_product/${product.images[1]}`}
                      alt={product.name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: 'auto',
                        borderRadius: '10px',
                        transition: '0.3s',
                        opacity: hoveredProductId === product._id ? 1 : 0,
                        pointerEvents: 'none',
                      }}
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div style={{ padding: '10px' }}>
                  <div className="d-flex align-items-center">
                    <Badge
                      style={{
                        backgroundColor: getRatingColor(product.rating),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      <FaStar /> {product.rating}
                    </Badge>
                  </div>
                  <h5 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                      {product.name}
                    </Link>
                  </h5>
                  <div className="mt-2">
                    <span
                      style={{
                        textDecoration: 'line-through',
                        marginRight: '8px',
                        color: '#888',
                      }}
                    >
                      ₹{product.totalPrice}
                    </span>
                    <span
                      style={{
                        color: '#d2512b',
                        fontWeight: 'bold',
                        marginRight: '8px',
                      }}
                    >
                      ₹{product.offerPrice}
                    </span>
                    <span
                      style={{
                        color: '#2ecc71',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      (Save ₹{(product.totalPrice - product.offerPrice).toFixed(2)})
                    </span>
                  </div>
                  <Button variant="secondary" style={{ width: '100%' }} onClick={() => addToCart(product._id)}>
                    + Add to cart
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default HairProduct;