import React, { useState } from 'react';
import axios from 'axios';
import { url } from './backendapi';

function FileUpload() {
  const [myData, setMyData] = useState({
    name: '',
    age: '',
    option: '',
    myImage: null,  // Initialize as null since we want to store the file here
  });

  const ChangeInpt = (e) => {
    setMyData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const ChangeFn = (e) => {
    setMyData((prev) => {
      return { ...prev, myImage: e.target.files[0] };  // Store the image file here
    });
  };

  const submitFn = async (e) => {
    e.preventDefault();
    console.log(myData);  // Check form data

    // Create a new FormData object
    const formData = new FormData();
    formData.append('name', myData.name);
    formData.append('age', myData.age);
    formData.append('option', myData.option);
    formData.append('myImage', myData.myImage);  // Add the image to FormData

    try {
      // Sending the form data to the backend (replace with the actual URL)
      const url = `${url}/default`;  // Example dynamic URL
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Set correct content type
        },
      });

      // Handle the response
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading the file:', error);
    }
  };

  return (
    <form onSubmit={submitFn}>
      <input
        type="text"
        value={myData.name}
        onChange={ChangeInpt}
        name="name"
        placeholder="Enter Name"
      />
      <input
        type="text"
        name="age"
        onChange={ChangeInpt}
        placeholder="Enter Age"
        value={myData.age}
      />
      <select name="option" onChange={ChangeInpt} value={myData.option}>
        <option value="Admin">Admin</option>
        <option value="User">User</option>
      </select>
      <input type="file" name="myImage" onChange={ChangeFn} />
      <input type="submit" />
    </form>
  );
}

export default FileUpload;