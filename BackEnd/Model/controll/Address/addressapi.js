const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Address = require('./addressmongoose');  // Assuming Address model is in the models folder
const User = require('../../../Model/user');  // Assuming User model is in the models folder

const app = express();
const port = 3000;


// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost:27017/address_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// API to add a new address
app.post('/add-address', async (req, res) => {
  const { user_id, name, street, city, state, zip } = req.body;

  // Check if all required fields are present
  if (!user_id || !name || !street || !city || !state || !zip) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create and save the address
    const address = new Address({
      user_id,
      name,
      street,
      city,
      state,
      zip,
    });

    await address.save();
    res.status(201).json({ message: 'Address added successfully', address });
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});