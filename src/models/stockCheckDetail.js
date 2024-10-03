'use strict';
const mongoose = require('mongoose');

// Define the schema for StockCheckDetail model
const stockCheckDetailSchema = new mongoose.Schema({
  stockCheckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockCheck', // Reference to StockCheck model
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to Product model
    required: true
  },
  expectedQuantity: {
    type: Number,
    required: true
  },
  actualQuantity: {
    type: Number,
    required: true
  },
  quantityDifference: {
    type: Number,
    default: function() {
      return this.actualQuantity - this.expectedQuantity;
    }
  },
  moneyDifference: {
    type: Number,
    required: true
  }
}, {
  timestamps: true // Automatically manage `createdAt` and `updatedAt`
});

// Export StockCheckDetail model
const StockCheckDetail = mongoose.model('StockCheckDetail', stockCheckDetailSchema);

module.exports = StockCheckDetail;
