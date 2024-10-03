'use strict';
const mongoose = require('mongoose');

// Define the schema for Sale model
const saleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to Customer model
    required: true
  },
  saleDate: {
    type: Date,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Define virtual association with SaleDetail model
saleSchema.virtual('saleDetails', {
  ref: 'SaleDetail', // Reference to SaleDetail model
  localField: '_id', // Local field in Sale
  foreignField: 'saleId' // Field in SaleDetail that references Sale
});

// Enable virtual fields (like 'saleDetails') when converting to JSON or Object
saleSchema.set('toObject', { virtuals: true });
saleSchema.set('toJSON', { virtuals: true });

// Export Sale model
const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
