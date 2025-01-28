const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const default11 = require('./img_upload/route');
const path = require('path');

// Import routes
const authRoutes = require('./Model/auth');
const loginRoute = require('./Model/login');
const adminRoutes = require('./Model/controll/adminportal');
const CouponCode = require('./Model/Couponcode');
const heading = require('./Model/controll/Headingadd');
const uploadRoute = require('./Model/controll/uploads/Banner/Bannereditanddelete');
const productapi = require('./Model/controll/Product/productapi');
const producttype = require('./Model/controll/Product/producttype/producttype');
const watchlist = require('./Model/controll/Watchlatest/Watchlist');
const addcart = require('./Model/controll/Product/Addcart/Addcart');
const orderconform = require('./Model/controll/Product/Order/orderinadd');
const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoDBURL = process.env.MONGODB_URI || 'mongodb+srv://dineshkumar:dinesh@cluster0.mysx0.mongodb.net/yourDatabaseName';

// mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(mongoDBURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes setup
function setupRoutes() {
  app.use(authRoutes);
  app.use(loginRoute);

  // Admin-related routes with '/admin' prefix
  app.use('/admin', adminRoutes);
  app.use('/admin', CouponCode);
  app.use('/admin', heading);
  app.use(default11)
  // Upload route for file uploads
  app.use('/admin', uploadRoute);
  app.use('/image_product', express.static(path.join(__dirname, 'Upload/products')));

  // app.use('/image_product',express.static('uploads'))
  app.use('/admin', productapi);
  app.use('/admin', producttype);
  app.use(addcart);
  app.use(watchlist);
  app.use(orderconform);
}



// Directory setup for uploads
function setupDirectories() {
  const uploadsDir = path.join(__dirname, 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
}

// Serve static files
function setupStaticFiles() {
  const uploadsDir = path.join(__dirname, 'uploads');
  app.use('/uploads', express.static(uploadsDir));
}

// Global error handling
function setupErrorHandling() {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
  });
}

// Initialize app setup
function initializeApp() {
  setupDirectories();
  setupRoutes();
  setupStaticFiles();
  setupErrorHandling();
}


// Start server
initializeApp();
const host ='0.0.0.0';
const port = process.env.PORT || 8080;
app.listen(port,host, () => console.log(`Server is running on port ${port}`));
