'use strict';
const mongoose = require('mongoose');

// Define the schema for OTP model
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true // Remove whitespace
  },
  otp: {
    type: String,
    required: true
  },
  expiry_time: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Export OTP model
const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
