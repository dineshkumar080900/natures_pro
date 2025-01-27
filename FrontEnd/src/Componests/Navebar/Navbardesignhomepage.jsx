import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Navbar, Nav, Offcanvas, Badge, Button } from 'react-bootstrap';
import { FiMenu, FiHeart } from 'react-icons/fi';
import { FaRegUserCircle, FaShoppingBag } from 'react-icons/fa';
import axios from 'axios';
import { url }  from "../../backendapi";
import './navbar.css';

const UnifiedNavbar = () => {
  const navigate = useNavigate();
let h4css={
  color:'white',
  fontWeight:'700'
}
  // State management
  const [state, setState] = useState({
    showMenu: false,
    showSearch: false,
    showLogin: false,
    showRegister: false,
    cartCount: 0,
    fullName: '',
    email: '',
    password: '',
    message: '',
    loading: false,
    isLoggedIn: !!localStorage.getItem('isLoggedIn'),
  });

  const { showMenu, showSearch, showLogin, showRegister, cartCount, message, loading, isLoggedIn, email, password, fullName } = state;

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await axios.get(`${url}/allcart?userId=${userId}`);
          setState(prev => ({ ...prev, cartCount: response.data.cartItems.length }));
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    };

    if (isLoggedIn) {
      fetchCartCount();
    }
  }, [isLoggedIn]);

  // Search handling
  const handleInputChange = (e) => setQuery(e.target.value);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoadingSearch(true);
    setErrorMessage('');

    try {
      const response = await axios.get(`${url}/api/products/search?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      setSearchResults([]);
      setErrorMessage('No products found or error occurred.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setState(prev => ({
        ...prev,
        message: 'Both email and password are required.',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, message: null }));
    try {
      const response = await axios.post(`${url}/login`, { email, password });
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('isLoggedIn', true);
      setState(prev => ({
        ...prev,
        isLoggedIn: true,
        message: '',
        loading: false,
      }));
      navigate('/'); // Redirect to the homepage
    } catch (error) {
      setState(prev => ({
        ...prev,
        message: error.response?.data?.message || 'Invalid email or password.',
        loading: false,
      }));
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, message: null }));

    try {
      await axios.post(`${url}/register`, { fullName, email, password });
      setState(prev => ({
        ...prev,
        message: 'Registration successful! Please login.',
        showRegister: false,
        fullName: '',
        email: '',
        password: '',
        loading: false,
      }));
      toggleState('showLogin');
    } catch (error) {
      setState(prev => ({
        ...prev,
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
        loading: false,
      }));
    }
  };

  // Toggle states for showMenu, showSearch, etc.
  const toggleState = (key) => setState(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* Header Section */}
      <Container fluid className="header-container" style={{ height: "100%", backgroundColor: "#b8c785", justifyContent: "center" }}>
        <Row className="align-items-center">
          <Col className="col-2 d-lg-none">
            <Button variant="link" onClick={() => toggleState('showMenu')} aria-label="Toggle menu" style={{backgroundColor:'#b8c785',border:'white'}}>
              <FiMenu style={{color:'white',backgroundColor:'#b8c785'}} size={24} />
            </Button>
          </Col>
          <Col className="col-lg-10 col-md-4 col-5 d-flex justify-item-center" style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <center>
              <h4 style={h4css}>
                Nature
              </h4>
            </center>
          </Col>
          <Col className="col-lg-2 col-md-4 col-5 d-flex justify-content-end icondetails" style={{ color: "red" }}>
            <i variant="link" onClick={() => toggleState('showSearch')} className="d-none d-lg-flex">
              {/* <FiSearch color='white m-1' size={20} /> */}
            </i>
            {!isLoggedIn ? (
              <i onClick={() => toggleState('showLogin')} aria-label="Login" title="Login">
                <FaRegUserCircle size={20} />
              </i>
            ) : (
              <button onClick={() => navigate('/account')} style={{ backgroundColor: '#b8c785' }} aria-label="Account" title="Go to Account Page">
                <FaRegUserCircle size={20} />
              </button>
            )}
            <i variant="link" onClick={() => navigate('/wishlist')}>
              <FiHeart color='white' size={24} />
            </i>
            <button onClick={() => navigate('/cart')} style={{ backgroundColor: '#b8c785', border: 'none' }} aria-label="Cart" title="View Cart">
              <FaShoppingBag color="" size={24} />
              {cartCount > 0 && (
                <Badge pill style={{ color: '', backgroundColor: 'red', position: 'absolute', top: '80px', right: '10px', fontSize: '10px' }}>
                  {cartCount}
                </Badge>
              )}
            </button>
          </Col>
        </Row>
      </Container>

      {/* Navbar Section */}
      <Navbar expand="lg" className="bg-light d-lg-flex d-none">
        <Container>
          <Navbar.Collapse>
            <Nav className="m-auto d-lg-flex">
              <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
              <Nav.Link onClick={() => navigate('/shop')}>Shop</Nav.Link>
              <Nav.Link onClick={() => navigate('/cart')}>Cart</Nav.Link>
              <Nav.Link onClick={() => navigate('/contact')}>Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Offcanvas Components */}
      <Offcanvas show={showMenu} onHide={() => toggleState('showMenu')}>
        <Offcanvas.Header closeButton style={{ color: "white", borderStyle: "solid", backgroundColor: "black" }}>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="d-block" style={{ color: "red" }}>
            <Nav.Link onClick={() => navigate('/')} style={{ color: "white", backgroundColor: "black" }}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/shop')}>Shop</Nav.Link>
            <Nav.Link onClick={() => navigate('/cart')}>Cart</Nav.Link>
            <Nav.Link onClick={() => navigate('/contact')}>Contact</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Login Offcanvas */}
      <Offcanvas show={showLogin} onHide={() => toggleState('showLogin')} placement="end">
        <Offcanvas.Header closeButton style={{backgroundColor:'#b8c785',color:'white'}}>
          <Offcanvas.Title >Login</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleLogin}>
            <input type="email" name="email" value={email} onChange={(e) => setState({ ...state, email: e.target.value })} placeholder="Email" className="form-control mb-3" required />
            <input type="password" name="password" value={password} onChange={(e) => setState({ ...state, password: e.target.value })} placeholder="Password" className="form-control mb-3" required />
            <Button type="submit" className="w-100" disabled={loading} style={{backgroundColor:'#b8c785',color:'white'}}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          {message && <p className="text-danger mt-3">{message}</p>}
          <p className="m-3" style={{ color: "black", textDecoration: "underline" }} onClick={() => toggleState('showRegister')}>Don't have an account? Register here</p>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Register Offcanvas */}
      <Offcanvas show={showRegister} onHide={() => toggleState('showRegister')} placement="end">
        <Offcanvas.Header closeButton style={{backgroundColor:'#b8c785',color:'white'}}>
          <Offcanvas.Title>Register</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleRegister}>
            <input type="text" name="fullName" value={fullName} onChange={(e) => setState({ ...state, fullName: e.target.value })} placeholder="Full Name" className="form-control mb-3" />
            <input type="email" name="email" value={email} onChange={(e) => setState({ ...state, email: e.target.value })} placeholder="Email" className="form-control mb-3" />
            <input type="password" name="password" value={password} onChange={(e) => setState({ ...state, password: e.target.value })} placeholder="Password" className="form-control mb-3" />
            <Button type="submit" style={{backgroundColor:'#b8c785',color:'white'}} className="w-100" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
          </form>
          {message && <p className="text-center text-danger mt-3">{message}</p>}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Search Offcanvas */}
      <Offcanvas show={showSearch} onHide={() => toggleState('showSearch')} placement="top">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <input type="text" placeholder="Search products" className="form-control" value={query} onChange={handleInputChange} />
            <button className="btn btn-primary mt-2" onClick={handleSearch} disabled={loadingSearch}>
              {loadingSearch ? 'Searching...' : 'Search'}
            </button>

            {searchResults.length > 0 && (
              <ul className="mt-3">
                {searchResults.map((product) => (
                  <li key={product._id}>
                    <strong>{product.name}</strong>
                    <p>{product.description}</p>
                  </li>
                ))}
              </ul>
            )}

            {errorMessage && !loadingSearch && <p className="text-danger mt-3">{errorMessage}</p>}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default UnifiedNavbar;