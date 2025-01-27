const express = require('express');
const Product = require('../productmongodb'); // Adjust the path to your Product model file
const router = express.Router();

// Product filter API
router.get('/filterProdct', async (req, res) => {
    try {
        // Extract filter parameters from query string
        const { category, priceMin, priceMax, rating, productcountMin, productcountMax } = req.query;

        // Build filter object based on query parameters
        const filter = {};

        // Filter by category if provided
        if (category) {
            filter.category = category;
        }

        // Filter by price range if provided
        if (priceMin || priceMax) {
            filter.totalPrice = {};
            if (priceMin) filter.totalPrice.$gte = parseFloat(priceMin);
            if (priceMax) filter.totalPrice.$lte = parseFloat(priceMax);
        }

        // Filter by rating if provided
        if (rating) {
            filter.rating = { $gte: parseFloat(rating) };
        }

        // Filter by product count range if provided
        if (productcountMin || productcountMax) {
            filter.productcount = {};
            if (productcountMin) filter.productcount.$gte = parseInt(productcountMin);
            if (productcountMax) filter.productcount.$lte = parseInt(productcountMax);
        }

        // Fetch products from database with filters applied
        const products = await Product.find(filter);

        // Return filtered products
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'An error occurred while fetching products.',
        });
    }
});

module.exports = router; // Export the router