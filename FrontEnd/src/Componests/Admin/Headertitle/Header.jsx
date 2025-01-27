import React, { useState, useEffect } from 'react';
import Sidebar from '../Adminmaincompoments/sidebar';
import Navabaradmin from '../Adminmaincompoments/Adminnavbar/Navabaradmin';
import { Col, Container, Row, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { url } from '../../../backendapi';

const HeaderTitleContent = () => {
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerContent, setHeaderContent] = useState('');
  const [message, setMessage] = useState('');
  const [headings, setHeadings] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the ID of the heading being edited

  // Fetch headings on component mount
  useEffect(() => {
    const fetchHeadings = async () => {
      try {
        const response = await axios.get(`${url}/admin/edingcode`);
        setHeadings(response.data);
      } catch (error) {
        console.error('Error fetching headings:', error);
        setMessage('Failed to fetch headings');
      }
    };

    fetchHeadings();
  }, []);

  // Submit new heading or update existing heading
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the form from submitting
    
    // Validate inputs
    if (!headerTitle.trim() || !headerContent.trim()) {
      setMessage('Both Title Heading and Title Content are required!');
      return;
    }

    try {
      if (editingId) {
        // Update existing heading
        const response = await axios.put(`${url}/admin/edingcode/${editingId}`, {
          titleheading: headerTitle.trim(),
          edingcontent: headerContent.trim(),
        });

        setMessage(response.data.message || 'Header updated successfully!');
        setHeadings((prev) =>
          prev.map((heading) =>
            heading._id === editingId
              ? { ...heading, titleheading: headerTitle, edingcontent: headerContent }
              : heading
          )
        );
        setEditingId(null); 
      } else {
       
        const response = await axios.post(`${url}/admin/addeding`, {
          titleheading: headerTitle.trim(),
          edingcontent: headerContent.trim(),
        });

        setMessage(response.data.message || 'Header added successfully!');
        setHeadings((prev) => [...prev, response.data.data]); // Add new heading to the list
      }

      setHeaderTitle('');
      setHeaderContent('');
    } catch (error) {
      console.error('Error submitting header content:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit header content';
      setMessage(errorMessage);
    }
  };

  // Handle delete heading
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/admin/headingdelete/${id}`);
      setMessage(response.data.message || 'Heading deleted successfully');
      setHeadings((prev) => prev.filter((heading) => heading._id !== id)); // Remove deleted heading
    } catch (error) {
      console.error('Error deleting header content:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete header content';
      setMessage(errorMessage);
    }
  };

  // Set the form fields for editing
  const handleEdit = (heading) => {
    setHeaderTitle(heading.titleheading);
    setHeaderContent(heading.edingcontent);
    setEditingId(heading._id); // Set the ID of the heading being edited
  };

  return (
    <>
      <Navabaradmin />
      <Row>
        <Col lg={3} className="d-lg-block d-none">
          <Sidebar />
        </Col>
        <Col>
          <Container>
            <h1>{editingId ? 'Edit Header Title' : 'Add Header Title'}</h1>
            <hr />
            <Row>
              <Col lg={4} xs={12}>
                <label htmlFor="header-title" style={{ fontWeight: 'bold' }}>Title Heading</label>
                <input
                  type="text"
                  id="header-title"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Type Header Title"
                  style={{ width: '100%', height: '50px', marginTop: '5px' }}
                />
              </Col>
              <Col lg={1}></Col>
              <Col lg={4} xs={12}>
                <label htmlFor="header-content" style={{ fontWeight: 'bold' }}>Title Content</label>
                <input
                  type="text"
                  id="header-content"
                  value={headerContent}
                  onChange={(e) => setHeaderContent(e.target.value)}
                  placeholder="Type Header Content"
                  style={{ width: '100%', height: '50px', marginTop: '5px' }}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={4} xs={12}>
                <Button
                  variant="danger"
                  onClick={handleSubmit}
                  style={{ padding: '10px 20px' }}
                >
                  {editingId ? 'Update Header' : 'Add Header'}
                </Button>
              </Col>
            </Row>
            {message && (
              <Row className="mt-4">
                <Col>
                  <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>
                    {message}
                  </p>
                </Col>
              </Row>
            )}
            <Row className="mt-5">
              <h1>List of Heading Details</h1>
              <hr />
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Title Heading</th>
                    <th>Title Content</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {headings.map((heading, index) => (
                    <tr key={heading._id}>
                      <td>{index + 1}</td>
                      <td>{heading.titleheading}</td>
                      <td>{heading.edingcontent}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(heading)}
                        >
                          Edit
                        </Button>
                        <hr />
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(heading._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  );
};

export default HeaderTitleContent;