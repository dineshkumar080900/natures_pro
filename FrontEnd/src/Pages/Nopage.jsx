import React from 'react';
import loading from '../assets/Animation/Nopage.gif';  // Ensure the path is correct
import HeadTopHeading from '../Componests/UserPageComponet.jsx/Navbarheadtop/swiperinword';
import UnifiedNavbar from '../Componests/Navebar/Navbardesignhomepage';
import FooterDetails from '../Componests/UserPageComponet.jsx/Foooter/Foooterdesign';

export default function Nopage() {
  return (
<>
<HeadTopHeading />
    <UnifiedNavbar />
    <div style={styles.container}>
      <img src={loading} alt="Loading..." style={styles.image} height={'600px'} />
    </div>
    <div className='bg-dark'>
    <FooterDetails /> 

    </div>
    

</>
    
  );
}

// Styling for centering the image and ensuring it scales properly
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    Width:"100%",
    height: '700%',  // Full viewport height
    backgroundColor: '#f0f0f0',  // Light background color
  },
  image: {
    Width: '100%',  // Ensures the image is responsive
  Height: '1400px',  // Ensures the image does not exceed the viewport
  },
};