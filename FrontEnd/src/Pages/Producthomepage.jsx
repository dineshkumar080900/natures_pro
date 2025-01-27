import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Badge, Spinner, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Icons for rating
import { Link } from 'react-router-dom';
import HeadTopHeading from '../Componests/UserPageComponet.jsx/Navbarheadtop/swiperinword';
import UnifiedNavbar from '../Componests/Navebar/Navbardesignhomepage';
import Footerdetails from '../Componests/UserPageComponet.jsx/Foooter/Foooterdesign';
import { url } from '../backendapi';

const HairProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Quantity state
  const [searchTerm, setSearchTerm] = useState(''); // Name search term
  const [minPrice, setMinPrice] = useState(0); // Minimum price filter
  const [maxPrice, setMaxPrice] = useState(10000); // Maximum price filter

  // Fetch all products without filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/admin/getproduct`); // Endpoint to get all products
      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
        setFilteredProducts(data.products); // Initially, set filteredProducts to all products
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding product to cart
  const addToCart = async (productId) => {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage

    if (!userId) {
      alert('Please log in to add items to the cart');
      return;
    }

    try {
      const response = await fetch(`${url}/addcart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, userId, quantity }), // Sending productId, userId, and quantity
      });
      const data = await response.json();

      if (data.success) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('An error occurred while adding the product to the cart.');
    }
  };

  // Handle search and filter
  const handleSearchAndFilter = () => {
    let filtered = products.filter((product) => {
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceRange = product.totalPrice >= minPrice && product.totalPrice <= maxPrice;
      return matchesSearchTerm && matchesPriceRange;
    });

    setFilteredProducts(filtered);
  };

  // Trigger fetch when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, minPrice, maxPrice]);

  // Fallback UI while loading
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <HeadTopHeading />

      <UnifiedNavbar />
      <Container fluid className="my-5">
        <Row>
          {/* Product Heading */}
          <Col xs={12}>
            <h1 className="text-center" style={{ fontSize: '36px', fontWeight: 'bold', color: '#333' }}>
              All Product
            </h1>
          </Col>

          {/* Search and Price Filter */}
          <Col xs={12} className="mb-4">
          <Col xs={12} className="mb-4">
  <Form>
    <Row className="d-flex align-items-center mb-4" style={{ flexWrap: 'wrap' }}>
      {/* Search by Name */}
      <Col xs={12} sm={6} md={4} className="mb-3">
        <Form.Group controlId="search" className="mb-1">
          <Form.Label>Search by Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: '25px',
              padding: '12px',
              marginBottom: "0px",
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Form.Group>
      </Col>

      {/* Min Price */}
      <Col xs={6} sm={3} md={2} className="mb-3">
        <Form.Group controlId="minPrice">
          <Form.Label>Min Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            style={{
              borderRadius: '25px',
              padding: '12px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Form.Group>
      </Col>

      {/* Max Price */}
      <Col xs={6} sm={3} md={2} className="mb-3">
        <Form.Group controlId="maxPrice">
          <Form.Label>Max Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{
              borderRadius: '25px',
              padding: '12px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Form.Group>
      </Col>

      {/* Apply Filters Button */}
      <Col xs={12} sm={12} md={2} className="mb-1">
        <Button
          variant="primary"
          onClick={handleSearchAndFilter}
          style={{
            width: '100%',
            borderRadius: '30px',
            padding: '12px',
            backgroundColor: 'gray',
            borderColor: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Apply Filters
        </Button>
      </Col>
    </Row>
  </Form>
</Col>
</Col>
       
          {/* Product Cards */}
          <Row className="mt-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center" style={{ width: '100%' }}>No products found</div>
            ) : (
              filteredProducts.map((product) => (
                <Col xs={12} sm={6} md={4} lg={3} key={product._id} className="mb-4">
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
                  >
                    {/* Stock Badge */}
                    {product.productcount <= 7 && (
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
                        Only {product.productcount} left
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
                          }}
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div style={{ padding: '10px' }}>
                      <div className="d-flex align-items-center">
                        <Badge style={{ backgroundColor: 'gold' }} className="p-1 m-1">
                          <FaStar color="gold" /> {product.rating}
                        </Badge>
                      </div>
                      <h5 style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                          {product.name}
                        </Link>
                      </h5>
                      <div style={{ marginBottom: '10px' }}>
                        <span
                          style={{
                            textDecoration: 'line-through',
                            fontSize: '15px',
                            color: 'gray',
                            marginRight: '5px',
                          }}
                        >
                          ₹{product.offerPrice}
                        </span>
                        <span style={{ fontSize: '18px', color: '#d2512b', fontWeight: 'bold' }}>
                          ₹{product.totalPrice}
                        </span>
                      </div>

                      <Button
                        variant="secondary"
                        style={{ width: '100%' }}
                        onClick={() => addToCart(product._id)} // Add product to cart when clicked
                      >
                        + Add to cart
                      </Button>
                    </div>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Row>
      </Container>

      <div className="bg-dark py-3">
        <Footerdetails />
      </div>
    </>
  );
};

export default HairProduct;