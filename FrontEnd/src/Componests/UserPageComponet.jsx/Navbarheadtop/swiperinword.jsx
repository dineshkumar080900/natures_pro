import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles.css'; 
import loading from '../../../assets/Animation/loading.gif'
import { Navigation, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import { Col, Container, Row } from 'react-bootstrap';
import { url } from '../../../backendapi';

export default function HeadTopHeading() {
  const [headings, setHeadings] = useState([]);

  // Fetch headings from the backend
  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await fetch(`${url}/admin/edingcode`); // Replace with your API endpoint
        const data = await response.json();
        setHeadings(data); 
        console.log(data);
      } catch (error) {
        console.error('Error fetching headings:', error);
      }
    };

    fetchHeadings();
  }, []);

  return (
    <div className="head-top-heading" style={{ backgroundColor: "#a4b660", justifyContent: "center" }}>
      <Swiper
        cssMode={true}
        mousewheel={true}
        keyboard={true}
        autoplay={{
          delay: 4000, // 4 seconds before moving to the next slide
          disableOnInteraction: false, // Continue autoplay after user interaction
        }}
        modules={[Navigation, Mousewheel, Keyboard, Autoplay]}
        className="mySwiper"
      >
        {headings.length > 0 ? (
          // Render each heading as a SwiperSlide
          headings.map((heading, index) => (
            <SwiperSlide key={index}>
              <Container>
                <Row className="d-flex justify-content-center">
                  <Col xs={12} lg={8} className="m-2">
                    <center>
                      <h2
                        style={{
                          color: 'white',
                          fontFamily: 'cursive',
                          fontSize: '16px',
                        }}
                      >
                        {heading.titleheading}
                        <span className="m-1" style={{ fontSize: '12px', color: 'gray' }}>||</span>
                        <span style={{ color: 'red' }}>{heading.edingcontent}</span>
                      </h2>
                    </center>
                  </Col>
                </Row>
              </Container>
            </SwiperSlide>
          ))
        ) : (
          // Show a loading message if no headings are available
          <SwiperSlide>
            <Container>
              <Row className="d-flex justify-content-center">
                <Col>
                  <h2 style={{ color: 'white' }}>   <img src={loading} alt="My Image" /></h2>
                </Col>
              </Row>
            </Container>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}