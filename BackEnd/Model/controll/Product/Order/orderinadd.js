const express = require('express');
const mongoose = require('mongoose');
const Order = require('../Order/order');  // Import the Order model
const Cart = require('../Addcart/Addcartmongoose');  // Import Cart model (to fetch cart items)
const router = express.Router();

// Route to place an order
router.post('/place-order', async (req, res) => {
  try {
    const { userId, cartId } = req.body;

    // Ensure both userId and cartId are provided
    if (!userId || !cartId) {
      return res.status(400).json({ message: 'userId and cartId are required' });
    }

    // Find the user's cart by cartId and populate the product details
    const cart = await Cart.findById(cartId).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calculate the total amount from the cart items
    let totalAmount = 0;
    const cartItems = cart.items.map(item => {
      const itemTotal = item.productId.price * item.quantity; // Calculate item total price
      totalAmount += itemTotal;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        option: item.productId.option,
        price: item.productId.price,
        quantity: item.quantity,
      };
    });

    // Create the order
    const order = new Order({
      userId,
      cartItems,
      totalAmount,
    });

    // Save the order to the database
    await order.save();

    // Optionally clear the cart after placing the order
    // await Cart.findByIdAndDelete(cartId);  // Uncomment if you want to delete the cart after order

    // Respond with the created order
    res.status(201).json(order);
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Error placing the order', error: err.message });
  }
});

// Route to get all orders for a user
router.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;  // Extract userId from URL parameters

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Find all orders for the given user and populate the cartItems with product details
    const orders = await Order.find({ userId }).populate('cartItems.productId');
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Respond with the user's orders
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Route to update the status of an order
router.put('/order/:orderId', async (req, res) => {
  try {
    const { status } = req.body;  // Get status to update (pending, shipped, delivered, canceled)
    const { orderId } = req.params;  // Extract orderId from URL parameters

    // Ensure status is provided
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Validate status value
    const validStatuses = ['pending', 'shipped', 'delivered', 'canceled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the order by orderId and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }  // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Respond with the updated order
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
});

module.exports = router;