const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../Addcart/Addcartmongoose'); // Cart model
const Product = require('../productmongodb'); // Product model

const router = express.Router();

// Add to Cart Route
router.post('/addcart', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // Step 1: Validate input fields
  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: userId, productId, and quantity.',
    });
  }

  try {
    // Step 2: Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Step 3: Check if there is enough stock available
    if (product.productcount < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    // Step 4: Check if the user already has this product in their cart
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // Step 5: If the product is already in the cart, update the quantity
      if (cartItem.quantity + quantity <= product.productcount) {
        cartItem.quantity += quantity;
        await cartItem.save();
        return res.status(200).json({
          success: true,
          message: 'Product quantity updated in the cart',
          cartItem,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock available for the requested quantity',
        });
      }
    } else {
      // Step 6: If the product is not in the cart, add a new cart item
      cartItem = new Cart({
        userId,
        productId,
        name: product.name,
        price: product.offerPrice,
        quantity,
      });
      await cartItem.save();
      return res.status(200).json({
        success: true,
        message: 'Product added to cart',
        cartItem,
      });
    }
  } catch (err) {
    console.error('Error adding product to cart:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
});

// Get Cart Route
router.get('/allcart', async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required.',
    });
  }

  try {
    // Find all cart items for the specific user
    const cartItems = await Cart.find({ userId })
      .populate('productId') // Populate the product details
      .exec();

    // Return the filtered cart items
    return res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Remove Product from Cart Route
router.delete('/allcart/:productId', async (req, res) => {
  const { productId } = req.params; // Get productId from the URL parameter
  const { userId } = req.query; // Get userId from the query parameters

  // Validate userId and productId
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  if (!productId) {
    return res.status(400).json({ success: false, message: 'Product ID is required.' });
  }

  try {
    // Validate the productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid Product ID format.' });
    }

    // Validate the userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
    }

    // Find and delete the item from the cart for the given user and product
    const cartItem = await Cart.findOneAndDelete({ userId, productId });

    // If the item wasn't found in the cart
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart for this user.' });
    }

    // Update the product quantity in the Product collection
    const product = await Product.findById(productId);
    if (product) {
      product.productcount += cartItem.quantity || 0; // Update the product count by the quantity removed from the cart
      await product.save(); // Save the updated product data
    }

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Product removed from cart.',
      cartItem,
    });
  } catch (err) {
    console.error('Error removing from cart:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
});

module.exports = router;