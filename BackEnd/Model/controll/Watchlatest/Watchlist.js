const express = require('express');
const router = express.Router();
const Watchlist = require('../Watchlatest/Watchlistmogoose'); // Replace with your Watchlist model path
const Product = require('../Product/productmongodb'); // Replace with your Product model path

// Add a product to the user's watchlist
router.post('/addwatchlist', async (req, res) => {
  const { userId, productId } = req.body;

  // Step 1: Validate required fields (userId and productId)
  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: 'Both userId and productId are required.',
    });
  }

  try {
    // Step 2: Check if the product exists in the Product collection
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Step 3: Check if the product is already in the user's watchlist
    const existingWatchlistItem = await Watchlist.findOne({ userId, productId });
    if (existingWatchlistItem) {
      return res.status(409).json({
        success: false,
        message: 'Product is already in your watchlist',
      });
    }

    // Step 4: Add the product to the user's watchlist
    const newWatchlistItem = new Watchlist({ userId, productId });
    await newWatchlistItem.save();

    // Optional: Get the updated watchlist and return it
    const updatedWatchlist = await Watchlist.find({ userId }).populate('productId');

    // Step 5: Return success response and the updated watchlist
    return res.status(201).json({
      success: true,
      message: 'Product successfully added to your watchlist',
      watchlist: updatedWatchlist,  // Returning updated watchlist
    });
  } catch (err) {
    console.error('Error adding product to watchlist:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
});

// Fetch the user's watchlist
router.get('/getwatchlist/:productid', async (req, res) => {
  const { userId } = req.query;  // Assume userId is passed as a query parameter
  const { productid } = req.params;  // Get productId from URL parameter

  // Step 1: Validate required fields (userId and productid)
  if (!userId) {
      return res.status(400).json({
          success: false,
          message: 'UserId is required.',
      });
  }
  
  if (!productid) {
      return res.status(400).json({
          success: false,
          message: 'ProductId is required.',
      });
  }

  try {
      // Step 2: Retrieve the user's watchlist items for a specific product
      const watchlistItems = await Watchlist.find({ 
          userId, 
          productId: productid // Assuming 'productId' is a field in the Watchlist model
      });

      // Step 3: Check if the user has any watchlist items for the specific product
      if (watchlistItems.length === 0) {
          return res.status(404).json({
              success: false,
              message: `No products found in the watchlist for product ID: ${productid}.`,
          });
      }

      // Step 4: Return success response with the watchlist items
      return res.status(200).json({
          success: true,
          message: 'Watchlist fetched successfully',
          watchlistItems, // Return the array of products in the user's watchlist
      });
  } catch (err) {
      console.error('Error fetching watchlist:', err);
      return res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: err.message,
      });
  }
});

// Remove product from the user's watchlist
router.post('/removewatchlist', async (req, res) => {
  const { userId, productId } = req.body;

  // Step 1: Validate required fields (userId and productId)
  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: 'Both userId and productId are required.',
    });
  }

  try {
    // Step 2: Check if the product exists in the Product collection
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Step 3: Check if the product is in the user's watchlist
    const watchlistItem = await Watchlist.findOne({ userId, productId });
    console.log('Watchlist Item:', watchlistItem); // Log the item for debugging

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in your watchlist',
      });
    }

    // Step 4: Remove the product from the user's watchlist
    await Watchlist.deleteOne({ userId, productId });

    // Optional: Get the updated watchlist and return it
    const updatedWatchlist = await Watchlist.find({ userId });

    // Step 5: Return success response and the updated watchlist
    return res.status(200).json({
      success: true,
      message: 'Product successfully removed from your watchlist',
      watchlist: updatedWatchlist,  // Returning updated watchlist
    });
  } catch (err) {
    console.error('Error removing product from watchlist:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
});

module.exports = router;