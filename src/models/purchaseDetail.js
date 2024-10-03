'use strict';
const mongoose = require('mongoose');

// Define the schema for PurchaseDetail model
const purchaseDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product model
    required: true
  },
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase', // Reference to Purchase model
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Export PurchaseDetail model
const PurchaseDetail = mongoose.model('PurchaseDetail', purchaseDetailSchema);

module.exports = PurchaseDetail;
