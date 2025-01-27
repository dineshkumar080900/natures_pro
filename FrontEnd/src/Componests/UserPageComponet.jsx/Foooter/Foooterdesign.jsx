import React from 'react';
import logo from '../../../assets/Image/Lkm1_1_47aec8f4-69ca-4d80-be5f-b941bc1bf140_155x@2x.webp';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

const FooterDetails = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'About Us',
      items: [
        'Our Story',
        'Mission & Values',
        'Meet the Team',
        'Sustainable Efforts',
        'Brand Partnerships',
        'Influencer Collaborations',
      ],
    },
    {
      title: 'Accessibility',
      items: [
        'Accessibility Statement',
        'Site Map',
        'Web Accessibility Options',
        'ADA Compliance',
        'Privacy Policy',
        'Terms of Service',
      ],
    },
    {
      title: 'Join Our Community',
      items: [
        'VIP Membership',
        'Loyalty Program',
        'Customer Reviews',
        'Style Forums',
        'Job Openings',
        'Culture and Values',
      ],
    },
  ];

  return (
    <footer className="footer text-light p-3 bg-black">
      <Container>
        <Row>
          {/* Logo and Intro Section */}
          <Col lg={3} md={6} className="mt-3 mb-4">
            <img
              src={logo}
              alt="Mixtas brand logo"
              height={30}
              onClick={() => navigate('/')}
              role="button"
            />
            <p className="py-2">
            Lakmē is India’s oldest beauty brand that most Indian women testify Most women testify that Lakmē cosmetic products are the safest. All Lakmē cosmetics are definitely safe and are made in adherence to the diverse complexion and skin types of Indian women. One size fits all doesn’t apply in makeup as each woman has a different skin type. Hence, it is advisable that before you start using them regularly, first test the product of your choice for a few days on a particular area to examine allergic reactions, if any.
            </p>
            <div className="d-flex">
              {['facebook', 'instagram', 'whatsapp', 'x-twitter'].map(
                (platform, index) => (
                  <div key={index} className="social_footericon m-2">
                    <i className={`fa-brands fa-${platform}`} />
                  </div>
                )
              )}
            </div>
          </Col>

          {/* Dynamic Section Links */}
          {sections.map((section, index) => (
            <Col lg={2} md={6} className="mt-3" key={index}>
              <h5 className="mb-3">{section.title}</h5>
              {section.items.map((item, i) => (
                <p key={i} className="mb-2">
                  {item}
                </p>
              ))}
            </Col>
          ))}

          {/* Newsletter Section */}
          <Col lg={3} className="mt-3">
            <h2 style={{color:"red"}}>Let's get in touch</h2>
            <p>
              Sign up for our newsletter and receive 10% off your next order.
            </p>
            <input
              type="email"
              className="form-control border-0 rounded py-2"
              placeholder="Enter your email address..."
              aria-label="Enter your email to sign up for the newsletter"
            />
          </Col>
        </Row>
      </Container>

      <hr className="text-light" />

      <Container>
        <div className="d-flex justify-content-between align-items-center pt-2">
          <p className="mb-0">
            &copy; 2024 Lakmē . All rights reserved. Designed by Dineshkumar K
          </p>
          <img
            src={logo}
            alt="Mixtas brand logo"
            height={30}
            aria-hidden="true"
          />
        </div>
      </Container>
    </footer>
  );
};

export default FooterDetails;