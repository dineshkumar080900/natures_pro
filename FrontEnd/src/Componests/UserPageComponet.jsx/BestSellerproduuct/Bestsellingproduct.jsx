import React, { useState, useEffect } from 'react';
import { Badge, Button, Col, Container, Row } from 'react-bootstrap';
import Slider from 'react-slick';
import { FaStar, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './bestselling.css';
import { url } from '../../../backendapi';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  // Get the current user ID from localStorage
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      setUserId(currentUserId);
    } else {
      console.log('User not logged in');
    }
  }, []);

  // Fetch user's watchlist
  useEffect(() => {
    if (userId) {
      const fetchWatchlist = async () => {
        try {
          const response = await fetch(`${url}/getwatchlist?userId=${userId}`);
          const data = await response.json();

          if (data.success) {
            setWatchlist(data.watchlistItems.map((item) => item.productId._id));
          } else {
            console.error('Failed to fetch watchlist:', data.message);
          }
        } catch (error) {
          console.error('Error fetching watchlist:', error);
        }
      };

      fetchWatchlist();
    }
  }, [userId]);

  // Fetch products from the API
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

  // Handle adding/removing products from the watchlist
  const handleToggleWatchlist = async (productId) => {
    const isInWatchlist = watchlist.includes(productId);

    if (isInWatchlist) {
      await removeFromWatchlist(productId);
    } else {
      await addToWatchlist(productId);
    }
  };

  const addToWatchlist = async (productId) => {
    try {
      const response = await fetch(`${url}/addwatchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await response.json();

      if (data.success) {
        setWatchlist((prevWatchlist) => [...prevWatchlist, productId]);
      } else {
        console.error('Failed to add to watchlist:', data.message);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };
const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'green'; // Excellent
  if (rating >= 3.5) return 'blue';  // Good
  if (rating >= 2.5) return 'orange'; // Average
  return 'red'; // Poor
};
  const removeFromWatchlist = async (productId) => {
    try {
      const response = await fetch(`${url}/removewatchlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await response.json();

      if (data.success) {
        setWatchlist((prevWatchlist) => prevWatchlist.filter((id) => id !== productId));
      } else {
        console.error('Failed to remove from watchlist:', data.message);
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert('Please log in to add items to the cart');
      return;
    }

    setCartLoading(true);

    try {
      const response = await fetch(`${url}/addcart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Product added to cart!');
      } else {
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center mb-3">
            <h2 className="section-title" style={{ fontWeight: 'bold', fontSize: '34px' }}>
              Best Sellers
            </h2>
          </div>
        </Col>
      </Row>

      <Container fluid>
        <Row>
          <Col>
            <div className="slider-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <Slider {...sliderSettings}>
                {products.map((product) => (
                  <div key={product._id} style={{ padding: '10px' }}>
                    <div
                      className="product-card"
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        background: '#fff',
                        padding: '15px',
                        position: 'relative',
                        height: '100%',
                      }}
                    >
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
                      <div className="product-info mt-3">
                      <Badge
  style={{
    backgroundColor: getRatingColor(product.rating),
    color: 'white', // Text color inside the badge
    fontWeight: 'bold',
  }}
>
  <FaStar /> {product.rating}
</Badge>
                        <h5>{product.name}</h5>
                        <p>Price: ₹{product.offerPrice}</p>
                        <Button onClick={() => addToCart(product._id)} style={{backgroundColor:'gray'}}>+Add Cart</Button>
                        {/* <FaHeart
                          color={watchlist.includes(product._id) ? 'red' : 'gray'}
                          onClick={() => handleToggleWatchlist(product._id)}
                          style={{ cursor: 'pointer' }}
                        /> */}
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ProductCard;
