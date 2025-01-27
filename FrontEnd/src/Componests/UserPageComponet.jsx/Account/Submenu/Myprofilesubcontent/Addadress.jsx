import React, { useState } from 'react';

const AddressForm = ({ userId }) => {
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Now you can use the userId when submitting the address
    const addressData = { ...address, user_id: userId };

    fetch('http://localhost:3000/add-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),  // Send the user_id with the address data
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Address added successfully') {
          console.log('Address added:', data.address);
        } else {
          console.error('Error adding address');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="card my-4" style={{ width: '25rem' }}>
      <div className="card-header">
        <h4>Add Address</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={address.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="street" className="form-label">Street</label>
            <input
              type="text"
              className="form-control"
              id="street"
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="state" className="form-label">State</label>
            <input
              type="text"
              className="form-control"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="zip" className="form-label">Zip Code</label>
            <input
              type="text"
              className="form-control"
              id="zip"
              name="zip"
              value={address.zip}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;