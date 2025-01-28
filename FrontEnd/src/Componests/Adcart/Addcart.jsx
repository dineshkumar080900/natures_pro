import React, { useEffect, useState } from 'react';
import UnifiedNavbar from '../Navebar/Navbardesignhomepage';
import HeadTopHeading from '../UserPageComponet.jsx/Navbarheadtop/swiperinword';
import { Col, Container, Row } from 'react-bootstrap';
import { url } from '../../backendapi';

export default function AddCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  // Fetch cart items when the component mounts or when userId changes
  useEffect(() => {
    if (!userId) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`${url}/allcart?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        console.log('Fetched Cart Data:', data);  // Log fetched data for debugging

        if (data.success) {
          setCartItems(data.cartItems);
        } else {
          throw new Error(data.message || 'Failed to fetch cart items');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  // Handle removing an item from the cart
  const handleRemoveItem = async (productId) => {
    if (!userId) {
      alert('User is not logged in!');
      return;
    }

    try {
      const response = await fetch(`${url}/allcart/${productId}?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId?._id !== productId));
        alert('Item removed from cart');
      } else {
        alert(data.message || 'Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
      alert('Internal server error, please try again later.');
    }
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    console.log('Cart Items:', cartItems); // Log cart items for debugging
    const total = cartItems.reduce((total, item) => {
      console.log('Item:', item);  // Log each item to check if the price and quantity are valid
      const price = item.productId?.offerPrice || 0; // Check if productId and price exist
      const quantity = item.quantity || 0; // Ensure quantity is valid

      if (isNaN(price) || isNaN(quantity)) {
        return total; // Skip invalid items
      }

      return total + price * quantity;
    }, 0);

    return total.toFixed(2); // Format to 2 decimal places for display
  };

  // Calculate total quantity
  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!userId) {
      alert('User not found!');
      return;
    }

    // Prevent checkout if cart is empty
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add items to the cart before proceeding.');
      return;
    }

    try {
      const response = await fetch(`${url}/place-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,  // Send userId only
          cartItems,  // Send cart items with product IDs and quantities
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCheckoutSuccess(true);
        alert(`Checkout successful! Order ID: ${data.orderId}`);
        window.location.href = `/order-summary/${data.orderId}`; // Redirect to order summary page
      } else {
        alert(data.message || 'Checkout failed');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Display error message if an error occurs
  if (error) {
    return <h2 className="text-center text-danger">{error}</h2>;
  }

  return (
    <>
      <HeadTopHeading />
      <UnifiedNavbar />
      <Container className="my-5">
        {cartItems.length === 0 ? (
          <div className="text-center my-5">
            <h3 className="text-gold">Your cart is empty.</h3>
            <button
              className="btn btn-gold mt-3"
              onClick={() => (window.location.href = '/products')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-gold mb-4">Your Cart</h3>
            {cartItems.map((item) => (
              <Row
                key={item._id}
                className="align-items-center mb-4 p-3"
                style={{
                  borderRadius: '20px',
                  border: '2px solid gold',
                  backgroundColor: '#fdf7e3',
                }}
              >
                <Col xs={12} sm={6} className="d-flex align-items-center mb-3 mb-sm-0">
                  <img
                    // Ensure images is defined, fallback if missing
                    src={`${url}/image_product/${item.productId?.images?.[0] || 'default-image.jpg'}`} 
                    alt={item.productId?.name || 'Product Image'}
                    className="img-fluid"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      marginRight: '10px',
                      border: '2px solid gold',
                    }}
                  />
                  <h5 className="mb-1 text-gold">{item.productId?.name || 'No Name Available'}</h5>
                </Col>

                <Col xs={6} sm={2} className="text-sm-center">
                  <p className="mb-0 text-gold">Price: ₹{item.productId?.offerPrice || '0'}</p>
                </Col>

                <Col xs={6} sm={2} className="text-sm-center">
                  <p className="mb-0 text-gold">Quantity: {item.quantity}</p>
                </Col>

                <Col xs={12} sm={2} className="text-end">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveItem(item.productId._id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </Col>
              </Row>
            ))}

            {/* Total Quantity and Total Price */}
            <div className="text-end mt-4">
              <h4 className="text-gold">Total Quantity: {calculateTotalQuantity()}</h4>
              <h4 className="text-gold">Total Price: ₹{calculateTotalPrice()}</h4>
              <button
                className="btn btn-success mt-3"
                style={{ borderRadius: '30px', padding: '10px 20px' }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}
