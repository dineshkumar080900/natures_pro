const express = require('express');
const mongoose = require('mongoose');

// Initialize Router
const router = express.Router();

// Define Schema for CouponCode
const couponCodeSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate coupon codes
    },
    price: {
        type: Number,
        required: true,
    },
});

// Create the CouponCode model
const CouponCode = mongoose.model('CouponCode', couponCodeSchema);

// Add new coupon code
router.post('/addCoupon', async (req, res) => {
    const { couponCode, price } = req.body;

    const newCoupon = new CouponCode({
        couponCode,
        price,
    });

    try {
        await newCoupon.save();
        res.status(201).send('Coupon code added successfully');
    } catch (err) {
        console.error('Error adding coupon code:', err);
        res.status(500).send('Error adding coupon code');
    }
});

// Retrieve all coupon codes
router.get('/couponCodes', async (req, res) => {
    try {
        const couponCodes = await CouponCode.find();
        res.json(couponCodes);
    } catch (err) {
        console.error('Error retrieving coupon codes:', err);
        res.status(500).send('Error retrieving coupon codes');
    }
});


router.delete('/deleteCoupon/:couponCode', async (req, res) => {
    const { couponCode } = req.params;

    try {
        const result = await CouponCode.deleteOne({ couponCode });

        if (result.deletedCount === 0) {
            return res.status(404).send('Coupon code not found');
        }

        res.status(200).send('Coupon code deleted successfully');
    } catch (err) {
        console.error('Error deleting coupon code:', err);
        res.status(500).send('Error deleting coupon code');
    }
});


// Export the router to use in the main app
module.exports = router;