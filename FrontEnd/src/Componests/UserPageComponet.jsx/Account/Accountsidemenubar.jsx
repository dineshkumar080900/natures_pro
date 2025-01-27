import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUser, FaMapMarkerAlt, FaBox, FaLock, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const sidebarItems = [
  { name: 'My Profile', icon: <FaUser />, link: '/my_profile' },
  { name: 'Delivery Address', icon: <FaMapMarkerAlt />, link: '/delivery_address' },
  { name: 'My Orders', icon: <FaBox />, link: '/my_orders' },
  { name: 'Logout', icon: <FaLock />, link: '/' },
];

const Accountsidemenubar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row',  // Change to row for sidebar and content next to each other
      minHeight: '100vh',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      paddingTop: '20px',
      transition: 'all 0.3s ease',
      zIndex: 1000,
    },
    sidebarContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      textDecoration: 'none',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '4px',
      fontSize: '16px',
      transition: 'background-color 0.3s',
    },
    linkHover: {
      backgroundColor: '#34495e',
    },
    icon: {
      marginRight: '10px',
    },
    hamburgerButton: (isLargeScreen) => ({
      display: isLargeScreen ? 'none' : 'block', // Show on small screens only
      position: 'absolute',
      top: '130px',
      left: '20px',
      cursor: 'pointer',
      zIndex: 1100,
      fontSize: '30px',
      color: 'black',
      padding: '10px',
    }),
    hamburgerIcon: {
      fontSize: '30px',
    },
    content: {
      flex: 1,  // The content should take the remaining space next to the sidebar
      transition: 'margin-left 0.3s ease',
      padding: '20px',
    },
  };

  return (
    <>
      <Container fluid className='p-0'>
        <Row>
          <Col>
            <div style={styles.hamburgerButton(isLargeScreen)} onClick={toggleSidebar}>
              {isOpen ?'':'' }
            </div>

            <div style={styles.sidebar}>
              <div style={styles.sidebarContent}>
                {sidebarItems.map((item) => (
                  item.name === 'Logout' ? (
                    <a
                      href="#"
                      key={item.name}
                      style={styles.link}
                      onClick={handleLogout}  // Trigger logout on click
                    >
                      <div style={styles.icon}>{item.icon}</div>
                      <span>{item.name}</span>
                    </a>
                  ) : (
                    <a href={item.link} key={item.name} style={styles.link}>
                      <div style={styles.icon}>{item.icon}</div>
                      <span>{item.name}</span>
                    </a>
                  )
                ))}
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col style={styles.content}>
            {/* Content goes here */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Accountsidemenubar;