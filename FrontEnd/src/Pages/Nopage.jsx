import React from 'react';
import loading from '../assets/Animation/Nopage.gif'; // Ensure the path is correct
import HeadTopHeading from '../Componests/UserPageComponet.jsx/Navbarheadtop/swiperinword';
import UnifiedNavbar from '../Componests/Navebar/Navbardesignhomepage';
import FooterDetails from '../Componests/UserPageComponet.jsx/Foooter/Foooterdesign';

export default function Nopage() {
  return (
    <>
      <HeadTopHeading />
      <UnifiedNavbar />
      <div style={styles.container}>
        <img src={loading} alt="Loading..." style={styles.image} />
      </div>
      <div className="bg-dark">
        <FooterDetails />
      </div>
    </>
  );
}

// Styling for centering the image and ensuring responsiveness
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh', // Full viewport height
    backgroundColor: '#f0f0f0', // Light background color
  },
  image: {
    maxWidth: '90%', // Ensures image does not overflow the screen
    height: 'auto', // Maintains aspect ratio
    objectFit: 'contain', // Ensures the image fits properly without cropping
  },
};

// Media Queries for Mobile Responsiveness
const mediaStyles = `
  @media (max-width: 768px) {
    img {
      max-width: 80%;
    }
  }
`;

// Inject styles into the page
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = mediaStyles;
document.head.appendChild(styleSheet);
