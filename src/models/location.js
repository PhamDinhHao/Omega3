'use strict';
const mongoose = require('mongoose');

// Define the schema for Location model
const locationSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
    trim: true // Remove whitespace
  },
  maxWeightCapacity: {
    type: Number,
    required: true // Use Number for float values
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Define virtual association with Product model
locationSchema.virtual('products', {
  ref: 'Product', // Reference to Product model
  localField: '_id', // Local field in Location
  foreignField: 'locationId' // Field in Product that references Location
});

// Enable virtual fields (like 'products') when converting to JSON or Object
locationSchema.set('toObject', { virtuals: true });
locationSchema.set('toJSON', { virtuals: true });

// Export Location model
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
