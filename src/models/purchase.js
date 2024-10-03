'use strict';
const mongoose = require('mongoose');

// Define the schema for Purchase model
const purchaseSchema = new mongoose.Schema({
  purchaseDate: {
    type: Date,
    required: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier', // Reference to Supplier model
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Define virtual association with PurchaseDetail model
purchaseSchema.virtual('purchaseDetails', {
  ref: 'PurchaseDetail', // Reference to PurchaseDetail model
  localField: '_id', // Local field in Purchase
  foreignField: 'purchaseId' // Field in PurchaseDetail that references Purchase
});

// Enable virtual fields (like 'purchaseDetails') when converting to JSON or Object
purchaseSchema.set('toObject', { virtuals: true });
purchaseSchema.set('toJSON', { virtuals: true });

// Export Purchase model
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
