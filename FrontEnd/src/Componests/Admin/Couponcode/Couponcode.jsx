import React, { useEffect, useState } from 'react';
import Sidebar from '../Adminmaincompoments/sidebar';
import Navabaradmin from '../Adminmaincompoments/Adminnavbar/Navabaradmin';
import { Col, Container, Row, Button, FormControl, Table } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../../backendapi';

const Couponcode = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({ couponCode: '', price: '' });
  const [message, setMessage] = useState('');


  // Fetch all coupon codes
  useEffect(() => {
    fetchCoupons();
  }, []);
console.log(url);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${url}/admin/couponCodes`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupon codes:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission to add a new coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/admin/addCoupon`, formData);
      if (response.status === 201) {
        setMessage('Coupon code added successfully!');
        setFormData({ couponCode: '', price: '' });
        fetchCoupons();
      }
    } catch (error) {
      setMessage('Error adding coupon code.');
    }
  };

  // Handle deleting a coupon code
  const handleDelete = async (couponCode) => {
    try {
       await axios.delete(`${url}/admin/deleteCoupon/${couponCode}`);
    
      setMessage('Coupon code deleted successfully!');
      fetchCoupons();
    } catch (error) {
      setMessage('Error deleting coupon code.');
      console.error('Error:', error);
    }
  };
console.log();

  return (
    <>
      <Navabaradmin />

      <Row>
        <Col lg={3} className="d-none d-lg-flex">
          <Sidebar />
        </Col>
        <Col>
          <Container>
            <h1>Add Coupon Code</h1>
            <hr />
            <Row>
              <Col lg={4} xs={12}>
                <div className="form-group">
                  <label htmlFor="couponCode" className="fw-bold">
                    Coupon Code
                  </label>
                  <FormControl
                    type="text"
                    name="couponCode"
                    id="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="Enter Coupon Code"
                    style={{ height: '50px', width: '100%' }}
                  />
                </div>
              </Col>
              <Col lg={4} xs={12}>
                <div className="form-group">
                  <label htmlFor="price" className="fw-bold">
                    Price
                  </label>
                  <FormControl
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter Price"
                    style={{ height: '50px', width: '100%' }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={4} xs={12}>
                <Button variant="danger" onClick={handleSubmit} style={{ padding: '10px 20px' }}>
                  Add Coupon
                </Button>
              </Col>
            </Row>
            {message && <p className="mt-3">{message}</p>}

            <Row className="mt-5">
              <h1>List of Added Coupon Codes</h1>
              <hr />
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                      <tr key={coupon.couponCode}>
                        <td>{coupon.couponCode}</td>
                        <td>{coupon.price}</td>
                        <td>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(coupon.couponCode)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No coupon codes found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  );
};

export default Couponcode;