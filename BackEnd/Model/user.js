const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });


// Model creation
const User = mongoose.model('User', userSchema);

module.exports = User;