import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col } from "react-bootstrap"; // Import Col for better responsiveness
import { useNavigate } from "react-router-dom";
import { url } from "../../../backendapi";

export default function Footercontent() {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  // Fetch banners from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${url}/admin/getbanners`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // Add content type if necessary
            'Authorization': 'Bearer YOUR_TOKEN', // Add authorization token if needed
          }
        });
        
        const data = await response.json();

        console.log('Footer Data:', data);

        if (data.success) {
          setBanners(data.banners); // Set the banners to the state
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
    slidesToShow: 1, // Default to 1 slide per view
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // For tablets and larger screens
        settings: {
          slidesToShow: 1, // Show 1 slide
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 1, // Show 1 slide
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For extra small devices
        settings: {
          slidesToShow: 1, // Show 1 slide
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container fluid className="p-0" style={{ overflow: "hidden" }}>
      <Row className="imagesiwper m-0">
        <Col xs={12} className="p-0">
          <Slider {...settings}>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                banner.option === "Footer" ? (
                  <div key={index} className="p-0" style={{ height: "300px", position: "relative" }}>
                    <img
                      className="bannerimage"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover", // Ensures image fills without distortion
                      }}
                      src={`${url}${banner.image}`}
                      alt={banner.name}
                    />
                  </div>
                ) : null
              ))
            ) : (
              <div className="text-center">Loading banners...</div>
            )}
          </Slider>
        </Col>
      </Row>
    </Container>
  );
}
