const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./user'); // Import User model
const router = express.Router();

// Secret Key for JWT Token (use environment variable in real applications)
const JWT_SECRET = 'yourSecretKey';

// Function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

// Register Route
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  // Input validation
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, 'user');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});


router.get('/user/:id', async (req, res) => {
  const { id } = req.params;  // Extract user ID from the URL parameter

  try {
    // Fetch the user from the database by their ID
    const user = await User.findById(id);

    // If the user doesn't exist, return a 404 (not found) error
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If the user is found, send back their non-sensitive data
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      userId: user._id,
    });
  } catch (error) {
    // If an error occurs (e.g., database issues), send a 500 (internal server error)
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});






router.post('/login', async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
        return res.status(400).json({ message: 'Both email and password are required.' });
      }

      const user = await User.findOne({ email });
          if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
          }
 
  res.json(user);
  console.log(user);
  
})
// Login Route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Input validation
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Both email and password are required.' });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password.' });
//     }

//     // Compare the provided password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password.' });
//     }

//     // Generate JWT token
//     const token = generateToken(user._id, 'user');

//     res.json({
//       message: 'Login successful',
//       token,
//       userId: user._id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error, please try again later.' });
//   }
// });

// Admin User Creation Function
async function createAdminUser() {
  const hashedPassword = await bcrypt.hash('1234', 10);

  return {
    id: 1,
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
  };
}

// Initialize admin user and save to a mock database (or actual DB)
createAdminUser().then((adminUser) => {
  const users = [adminUser]; // In-memory user storage (replace with DB logic)

  // Admin Login Route
  router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    // Find admin user by username
    const user = users.find((u) => u.username === username && u.role === 'admin');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    res.json({ message: 'Login successful', token });
  });

  // Middleware to verify JWT token
  function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Access denied' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  // Admin Dashboard Route (Protected)
  router.get('/admin/dashboard', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ message: 'Welcome to the admin dashboard!' });
  });
});




router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Logout failed. Please try again.' });
    }

    // Clear session cookie
    res.clearCookie('connect.sid', { path: '/' });
    return res.status(200).json({ message: 'Logged out successfully.' });
  });
});




router.put('/update', async (req, res) => {
  const { userId, fullName, email, password } = req.body;

  // Validate required fields
  if (!userId || !fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the email is already in use by another user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'Email is already in use by another account.' });
    }

    // Hash the new password if it's provided
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    user.fullName = fullName;
    user.email = email;
    user.password = hashedPassword; // Store the hashed password

    // Save the updated user document
    await user.save();

    // Generate a new JWT token after updating the user
    const token = generateToken(user._id, 'user');

    res.status(200).json({
      message: 'User details updated successfully.',
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
});



module.exports = router;