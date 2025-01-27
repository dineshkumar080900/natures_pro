import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import logodmin from '../../assets/Image/Lkm1_1_47aec8f4-69ca-4d80-be5f-b941bc1bf140_155x@2x.webp';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sending login data to backend
      const response = await axios.post('/adminlogin', { username, password });
     
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the token
        setToken(response.data.token); // Update the state
        setUsername('');
        setPassword('');
        setErrorMessage('');
        navigate('/'); // Navigate to the home page or another protected route
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // Display error message from backend
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logodmin} alt="Lakmin Logo" className="logo" />
        </div>
        <h2>Admin Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;