'use strict';
const mongoose = require('mongoose');

// Define the schema for Product model
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  quantity: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier', // Reference to Supplier model
    required: true
  },
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit', // Reference to Unit model
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to Category model
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
  waitTime: {
    type: Number,
    required: false
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location', // Reference to Location model
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Define virtual association with StockCheckDetail model
productSchema.virtual('stockCheckDetails', {
  ref: 'StockCheckDetail', // Reference to StockCheckDetail model
  localField: '_id', // Local field in Product
  foreignField: 'productId' // Field in StockCheckDetail that references Product
});

// Enable virtual fields (like 'stockCheckDetails') when converting to JSON or Object
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

// Export Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
