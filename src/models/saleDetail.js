'use strict';
const mongoose = require('mongoose');

// Define the schema for SaleDetail model
const saleDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product model
    required: true
  },
  saleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale', // Reference to Sale model
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Export SaleDetail model
const SaleDetail = mongoose.model('SaleDetail', saleDetailSchema);

module.exports = SaleDetail;
