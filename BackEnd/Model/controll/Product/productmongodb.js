const mongoose = require('mongoose');

// Define the Product schema
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], // Custom error message
        trim: true, // Remove extra spaces
    },
    option: {
        type: String,
        required: [true, 'Option is required'], // Custom error message
    },
    description: {
        type: String,
        required: [true, 'Description is required'], // Corrected field name
        trim: true,
    },
    totalPrice: {
        type: Number, // Use Number for price-related fields
        required: [true, 'Total price is required'],
    },
    productcount: {
        type: Number, // Use Number for price-related fields
        required: [true, 'Product count is required'], // Corrected field name for clarity
    },
    offerPrice: {
        type: Number, // Use Number for price-related fields
        required: [true, 'Offer price is required'],
    },
    productDetails: {
        type: String,
        required: [true, 'Product details are required'],
        trim: true,
    },
    images: [
        {
            type: String,
            required: [true, 'At least one image is required'], // Custom error message for images array
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now, // Auto-set to current date
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'], // Corrected error message
    },
});

// Create the Product model based on the schema
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;