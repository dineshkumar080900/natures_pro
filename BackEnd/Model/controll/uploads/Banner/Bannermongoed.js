const mongoose = require('mongoose');

// Define the Banner schema
const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], // Custom error message
    },
    option: {
        type: String,
        required: [true, 'Option is required'], // Custom error message
    },
    image: {
        type: String,
        required: [true, 'Image is required'], // Custom error message
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Create the Banner model based on the schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;  