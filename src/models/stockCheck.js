'use strict';
const mongoose = require('mongoose');

// Define the schema for StockCheck model
const stockCheckSchema = new mongoose.Schema({
  checkDate: {
    type: Date,
    required: true
  },
  totalActualQuantity: {
    type: Number,
    required: true
  },
  totalActualMoney: {
    type: Number,
    required: true
  },
  totalIncreaseQuantity: {
    type: Number,
    // required: true
  },
  totalIncreaseMoney: {
    type: Number,
    // required: true
  },
  totalDecreaseQuantity: {
    type: Number,
    // required: true
  },
  totalDecreaseMoney: {
    type: Number,
    // required: true
  },
  totalQuantityDifference: {
    type: Number,
    // required: true
  },
  totalMoneyDifference: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Define virtual association with StockCheckDetail model
stockCheckSchema.virtual('details', {
  ref: 'StockCheckDetail', // Reference to StockCheckDetail model
  localField: '_id', // Local field in StockCheck
  foreignField: 'stockCheckId' // Field in StockCheckDetail that references StockCheck
});

// Enable virtual fields (like 'details') when converting to JSON or Object
stockCheckSchema.set('toObject', { virtuals: true });
stockCheckSchema.set('toJSON', { virtuals: true });

// Export StockCheck model
const StockCheck = mongoose.model('StockCheck', stockCheckSchema);

module.exports = StockCheck;
