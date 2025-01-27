import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './bannersiwper.css';
import loading from '../../assets/Animation/loading.gif'
import { url } from "../../backendapi";


export default function Bannerslider() {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  // Fetch banners from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${url}/admin/getbanners`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_TOKEN', // Replace with actual token if required
          },
        });

        const data = await response.json();

        console.log('Banners Data:', data);

        if (data.success) {
          setBanners(data.banners);
        } else {
          console.error('Failed to fetch banners');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container fluid className="p-0" style={{ overflow: "hidden" }}>
      {/* Row for Slider */}
      <Row className="imagesiwper m-0">
        <Col xs={12} className="p-0">
          {/* Slider for banners */}
          <Slider {...settings}>
            {banners.length > 0 ? (
              banners.map((banner, index) =>
                banner.option === 'Header' ? (
                  <div key={index} className="banner-slide">
                   <img
  className="banner-image"
  src={`${url}${banner.image}`}
  alt={banner.name}
  style={{
    width: "100%", // Ensures the image spans the full width of its container
    height: "auto", // Maintains the image's aspect ratio
    objectFit: "cover", // Ensures the image covers its container without distortion
    maxHeight: "400px", // Limits the maximum height for larger screens
  }}
/>
                  </div>
                ) : null
              )
            ) : (
              <div className="text-center"> <img src={loading} alt="My Image" /></div>
            )}
          </Slider>
        </Col>
      </Row>
    </Container>
  );
}