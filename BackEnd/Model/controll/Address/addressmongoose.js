const mongoose = require('mongoose');

// Address schema definition
const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
}, { timestamps: true });  // This will automatically include `createdAt` and `updatedAt` fields

// Model creation
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;