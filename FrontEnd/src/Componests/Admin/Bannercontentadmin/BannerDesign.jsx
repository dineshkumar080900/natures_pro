import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Adminmaincompoments/sidebar';
import NavbarAdmin from '../Adminmaincompoments/Adminnavbar/Navabaradmin';
import { Button, Col, Container, Row, Spinner, Table, Modal } from 'react-bootstrap';
import { url } from '../../../backendapi';

const BannerDesign = () => {
  const [image, setImage] = useState(null);
  const [bannerName, setBannerName] = useState('');
  const [bannerType, setBannerType] = useState('Header');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete modal
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null); // State to store the banner to be deleted

  // Fetch all banners from the server
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}/admin/getbanners`);
      if (response.data && response.data.success && Array.isArray(response.data.banners)) {
        setBanners(response.data.banners);
      } else {
        console.error('Error fetching banners:', response.data);
        setBanners([]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file selection and preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (.jpeg, .jpg, .png)');
        setImage(null);
        setPreviewUrl(null);
        return;
      }
      setError('');
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Cleanup the preview URL when component unmounts
  useEffect(() => {
    fetchBanners();
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle form submission to add a banner
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !bannerName.trim()) {
      setError('Please fill out all fields and upload a valid image.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('myImage', image);
      formData.append('name', bannerName);
      formData.append('option', bannerType);

      const response = await fetch(`${url}/admin/addbanner`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Banner added successfully!');
        setError('');
        setImage(null);
        setPreviewUrl(null);
        setBannerName('');
        setBannerType('Header');
        setBanners((prevBanners) => [...prevBanners, data.banner]);
      } else {
        setError('Error adding banner.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete banner
  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      const response = await axios.delete(`${url}/admin/banners/${bannerToDelete._id}`);
      if (response.data.success) {
        setBanners(banners.filter((banner) => banner._id !== bannerToDelete._id));
        // alert('Banner deleted successfully.');
      } else {
        // alert('Error deleting banner.');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('An error occurred while deleting the banner.');
    } finally {
      setShowDeleteModal(false); // Close the delete confirmation modal
      setBannerToDelete(null); // Clear the banner to be deleted
    }
  };

  // Handle edit banner
  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerName(banner.name);
    setBannerType(banner.option);
    setPreviewUrl(`${url}/${banner.image}`);
    setShowEditModal(true);
  };

  // Handle update banner
  const handleUpdateBanner = async (e) => {
    e.preventDefault();

    if (!bannerName.trim()) {
      setError('Please fill out the banner name.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('myImage', image || editingBanner.image); // Send image if updated
      formData.append('name', bannerName);
      formData.append('option', bannerType);

      const response = await fetch(`${url}/admin/banners/${editingBanner._id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Banner updated successfully!');
        setBanners((prevBanners) =>
          prevBanners.map((banner) =>
            banner._id === editingBanner._id ? { ...banner, ...data.banner } : banner
          )
        );
        setShowEditModal(false);
        setError('');
        setImage(null);
        setPreviewUrl(null);
      } else {
        setError('Error updating banner.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while updating the banner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-0">
      <NavbarAdmin />
      <Row>
        <Col lg={3} className="d-lg-block d-none">
          <Sidebar />
        </Col>
        <Col lg={9}>
          <Container className="mt-4">
            <h1>Add Banner</h1>
            <hr />
            <form onSubmit={handleSubmit}>
              {/* Form fields for adding banners */}
              <Row>
                <Col lg={6}>
                  <label>Banner Name</label>
                  <input
                    type="text"
                    value={bannerName}
                    onChange={(e) => setBannerName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Banner Name"
                  />
                </Col>
                <Col lg={6}>
                  <label>Banner Type</label>
                  <select
                    value={bannerType}
                    onChange={(e) => setBannerType(e.target.value)}
                    className="form-control"
                  >
                    <option value="Header">Header</option>
                    <option value="Footer">Footer</option>
                  </select>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={12}>
                  <label>Banner Image</label>
                  <div
                    id="image-upload"
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    onClick={() => document.getElementById('files').click()}
                  >
                    <img
                      src={previewUrl || 'placeholder-image-url'}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                    <p>Upload Image Here</p>
                  </div>
                  <input
                    type="file"
                    id="files"
                    hidden
                    onChange={handleImageChange}
                  />
                  <p>*Accepts .jpeg/.jpg/.png formats only</p>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </Col>
              </Row>
              <Button type="submit" className="mt-3 btn-danger" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Add Banner'}
              </Button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <hr />
            <h2>All Banners</h2>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <Spinner animation="border" />
                      </td>
                    </tr>
                  ) : (
                    banners.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No banners available.
                        </td>
                      </tr>
                    ) : (
                      banners.map((banner, index) => (
                        <tr key={banner._id}>
                          <td>{index + 1}</td>
                          <td>{banner.name}</td>
                          <td>{banner.option}</td>
                          <td>
                          <img
                            src={`${url}${banner.image}`}  // Concatenates the `url` and `banner.image` to form the full image URL
                            alt={banner.name}  // Sets the alt attribute of the image for accessibility and SEO
                            style={{ width: '100px' }}  // Applies inline CSS to set the width of the image
                          />
                          </td>
                          <td className="col-4">
                            <Button variant="info" className="m-1 col-lg-3" onClick={() => handleEditBanner(banner)}>
                              Edit
                            </Button>
                            <Button variant="danger" className="m-1 col-lg-3" onClick={() => {
                              setBannerToDelete(banner); // Set the banner to delete
                              setShowDeleteModal(true); // Show the delete confirmation modal
                            }}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </Table>
            </div>
          </Container>
        </Col>
      </Row>

      {/* Edit Banner Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateBanner}>
            <Row>
              <Col lg={6}>
                <label>Banner Name</label>
                <input
                  type="text"
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  className="form-control"
                  placeholder="Enter Banner Name"
                />
              </Col>
              <Col lg={6}>
                <label>Banner Type</label>
                <select
                  value={bannerType}
                  onChange={(e) => setBannerType(e.target.value)}
                  className="form-control"
                >
                  <option value="Header">Header</option>
                  <option value="Footer">Footer</option>
                </select>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12}>
                <label>Banner Image</label>
                <div
                  id="image-upload"
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => document.getElementById('files').click()}
                >
                  <img
                    src={previewUrl || 'placeholder-image-url'}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                  <p>Upload Image Here</p>
                </div>
                <input
                  type="file"
                  id="files"
                  hidden
                  onChange={handleImageChange}
                />
                <p>*Accepts .jpeg/.jpg/.png formats only</p>
              </Col>
            </Row>
            <Button type="submit" className="mt-3 btn-danger" disabled={loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update Banner'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this banner?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button className='col-4' variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button className='col-4' variant="danger" onClick={handleDeleteBanner}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BannerDesign;
