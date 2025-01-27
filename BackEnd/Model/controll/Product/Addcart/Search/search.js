// routes/productRoutes.js

const express = require('express');
const Product = require('../../productmongodb');
const router = express.Router();

// Search route
router.get('/search', async (req, res) => {
  const { query } = req.query; // Get the search query from the query parameter
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    // Search for products that match the query (case-insensitive)
    const products = await Product.find({
      name: { $regex: query, $options: 'i' }, // Regex search with case-insensitivity
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;