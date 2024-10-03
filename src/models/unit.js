'use strict';
const mongoose = require('mongoose');

// Define the schema for Unit model
const unitSchema = new mongoose.Schema({
  unitName: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // automatically manage `createdAt` and `updatedAt`
});

// Define the association with Product model
unitSchema.virtual('products', {
  ref: 'Product', // Reference to Product model
  localField: '_id', // Local field in Unit
  foreignField: 'unitId' // Field in Product that references Unit
});

// Enable virtual fields (like 'products') to be included when converting documents to JSON
unitSchema.set('toObject', { virtuals: true });
unitSchema.set('toJSON', { virtuals: true });

// Export Unit model
const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
