const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Initialize the app
const app = express();
const SECRET_KEY = 'your_secret_key';  // Keep this secret

// Middleware
app.use(bodyParser.json());

// Sample data for demonstration (replace with a real database)
let users = [
  { id: 1, name: 'John Doe', role: 'admin', password: '$2b$10$K9B7ZYqX6D8V4l4WqH9uPOVtYQU4QQy6YkI/dQSkPckErjjguyQZm' }, // hashed password: 'adminpassword'
  { id: 2, name: 'Jane Smith', role: 'user', password: '$2b$10$4d9EdoC2T0F9r7MIFhg7hqlpXjtx9xtplEC5H6HkaUdCNHs3jmyti' } // hashed password: 'userpassword'
];

// Admin middleware to check JWT token and admin role
function isAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(403).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role === 'admin') {
      req.user = decoded;  // Attach user data to request
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Admin login route
app.post('/adminlogin', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.name === username);

  if (user) {
    // Check the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Routes
// Public route
app.get('/', (req, res) => {
  res.send('Welcome to the Express API!');
});

// Admin route
app.get('/admin', isAdmin, (req, res) => {
  res.json({
    message: 'Welcome, Admin!',
    adminData: { secretInfo: '42 is the answer to life.' }
  }); 
});

// Export the app
module.exports = app;