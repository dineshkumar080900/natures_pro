import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footerdetails from '../Componests/UserPageComponet.jsx/Foooter/Foooterdesign';
import UnifiedNavbar from '../Componests/Navebar/Navbardesignhomepage';
import { Col, Container, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Navigation, Thumbs } from 'swiper/modules';
import '../App.css';
import Homepageflowcontent from '../Componests/UserPageComponet.jsx/Homepagecontent/Homepageflowcontent';
import HeadTopHeading from '../Componests/UserPageComponet.jsx/Navbarheadtop/swiperinword';
import { url } from '../backendapi';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [apiError, setApiError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      alert('You must be logged in to access this page.');
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/admin/getproduct/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch product: ${response.statusText}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          throw new Error('Product data not available');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!userId) {
      alert('User not logged in!');
      navigate('/login');
      return;
    }
    if (product?.productcount >= quantity) {
      try {
        const response = await fetch(`${url}/addcart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            productId: product._id,
            quantity,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setApiError(errorData.message || 'Failed to add to cart');
        } else {
          alert('Product added to cart');
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        setApiError('Internal Server Error, please try again later.');
      }
    } else {
      setApiError('Not enough stock available');
    }
  };

  if (loading) return <h2 className="text-center">Loading...</h2>;
  if (error) return <h2 className="text-center text-danger">Error: {error}</h2>;
  if (!product || !product.images?.length) return <h2 className="text-center">Product not found or images are missing</h2>;

  return (
    <>
         <HeadTopHeading />
    
      <UnifiedNavbar />
              <Homepageflowcontent />
      
      <Container className="my-5">
        <Row>
          {/* Product Image Slider */}
          <Col xs={12} lg={6} className="mb-4">
            <h2 className="text-center d-lg-none mb-3">{product.name}</h2>
            <Swiper
              style={{ height: '400px', borderRadius: '20px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}
              navigation
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              className="mainSwiper"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${url}/image_product/${image}`}
                    alt={`Slide ${index + 1}`}
                    style={{ width: '100%', height: '100%', borderRadius: '30px', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              style={{ marginTop: '20px' }}
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              spaceBetween={10}
              modules={[Thumbs]}
              className="thumbsSwiper"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${url}/image_product/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-100 h-100 p-1"
                    style={{ borderRadius: '10px', cursor: 'pointer', objectFit: 'cover' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>

          {/* Product Details */}
          <Col xs={12} lg={6}>
            <h2 className="d-none d-lg-block" style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              {product.name}
            </h2>
            <p style={{ color: '#777' }}>{product.description}</p>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#a4b660' }}>Rating: </span>
              <span>{product.rating} <span style={{ color: 'gold' }}>⭐</span></span>
            </div>
            <h4 className="my-3" style={{ fontSize: '22px', color: '#d2512b', fontWeight: 'bold' }}>
  ₹{product.offerPrice} 
  <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '16px', marginLeft: '10px' }}>
    ₹{product.totalPrice}
  </span>
  <span
    style={{
      color: '#2ecc71',
      fontSize: '16px',
      marginLeft: '10px',
      fontWeight: 'bold',
    }}
  >
    (Save ₹{(product.totalPrice - product.offerPrice).toFixed(2)})
  </span>
</h4>
            <p style={{ fontSize: '14px', color: '#777' }}>(MRP inclusive of taxes)</p>
            <p>{product.productDetails}</p>

            {apiError && <div className="alert alert-danger" role="alert">{apiError}</div>}

            {/* Quantity and Add to Cart */}
            <div className="cart mt-4 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '18px',
                  borderColor: '#a4b660',
                  color: '#a4b660',
                }}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>

              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  width: '60px',
                  textAlign: 'center',
                  margin: '0 10px',
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '18px',
                  borderColor: '#a4b660',
                  color: '#a4b660',
                }}
                onClick={() => setQuantity((prev) => Math.min(product.productcount, prev + 1))}
                disabled={quantity >= product.productcount}
              >
                +
              </button>

              <button
                className="btn m-3"
                style={{
                  color: 'whitesmoke',
                  width: '120px',
                  borderRadius: '40px',
                  backgroundColor: '#a4b660',
                  transition: 'background-color 0.3s ease',
                }}
                onClick={addToCart}
                disabled={product.productcount <= 0}
              >
                Add to Cart
              </button>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>

      </Container>

      <div className="bg-dark py-3">
        <Footerdetails />
      </div>
    </>
  );
}