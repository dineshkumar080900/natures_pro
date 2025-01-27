import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const ScrollingSection = () => {
  const scrollContent = [
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/High_performance_icon.png?v=1691585063",
      text: "High performance formulation",
    },
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/Safe_and_sustainable_icon.png?v=1691585047",
      text: "Safe & sustainable",
    },
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/Binge_on_milk_icon.png?v=1691585029",
      text: "Binge on milk",
    },
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/For_the_real_you_icon.png?v=1691585011",
      text: "For the real you",
    },
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/For_the_real_you_icon.png?v=1691585011",
      text: "For the real you",
    },
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/For_the_real_you_icon.png?v=1691585011",
      text: "For the real you",
    },
    {
      imgSrc: "//www.vilvahstore.com/cdn/shop/files/For_the_real_you_icon.png?v=1691585011",
      text: "For the real you",
    },
  ];

  return (
    <Container fluid className="section section-blends d-inline section-full text-custom">
      {/* Row to wrap the scrolling section */}
      <Row className="scrolling-text scrolling-text--auto" style={{ backgroundColor: "#fffff" }}>
        <Col xs={12} className="p-0">
          {/* Wrapper for the scrolling content */}
          <div
            className="scrolling-text__wrapper"
            style={{
              display: "inline-flex",
              animationDuration: "0.908s",
              flexWrap: "nowrap", // Ensures all content stays in a single line without wrapping
              overflowX: "auto", // Enables horizontal scrolling
            }}
          >
            {/* Mapping through scrollContent array */}
            {scrollContent.map((item, index) => (
              <div
                className="scroll_content_wrapper"
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginRight: "20px",
                }}
              >
                {/* Image for each scroll item */}
                <img
                  src={item.imgSrc}
                  alt={item.text}
                  className="scroll_img"
                  width="30px"
                  height="30px"
                  loading="lazy"
                />
                {/* Text for each scroll item */}
                <span
                  className="scroll_txt bold"
                  style={{
                    color: "#a4b660",
                    margin: "5px",
                    fontSize: "30px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ScrollingSection;