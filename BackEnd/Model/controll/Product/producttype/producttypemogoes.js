const mongoose = require('mongoose');

const ProductTypeSchema = new mongoose.Schema({
  producttype: {
    type: String,
    required: [true, 'Product type is required'],
    trim: true,  // Trim any extra spaces from the input
  }
});

const ProductType = mongoose.model('ProductType', ProductTypeSchema);

module.exports = ProductType;