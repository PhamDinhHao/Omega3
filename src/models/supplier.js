'use strict';
const mongoose = require('mongoose');

// Define the schema for Supplier model
const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  debtSupplier: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Define virtual association with Product model
supplierSchema.virtual('products', {
  ref: 'Product', // Reference to Product model
  localField: '_id', // Local field in Supplier
  foreignField: 'supplierId' // Field in Product that references Supplier
});

// Define virtual association with Purchase model
supplierSchema.virtual('purchases', {
  ref: 'Purchase', // Reference to Purchase model
  localField: '_id',
  foreignField: 'supplierId'
});

// Enable virtual fields (like 'products' and 'purchases') when converting to JSON or Object
supplierSchema.set('toObject', { virtuals: true });
supplierSchema.set('toJSON', { virtuals: true });

// Export Supplier model
const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
