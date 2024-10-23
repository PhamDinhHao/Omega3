'use strict';
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ'],
  },
  birthday: {
    type: Date,
  },
  debtCustomer: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true 
});

customerSchema.virtual('sales', {
  ref: 'Sale',
  localField: '_id',
  foreignField: 'customerId'
});

customerSchema.set('toObject', { virtuals: true });
customerSchema.set('toJSON', { virtuals: true });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
