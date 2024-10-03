'use strict';
const mongoose = require('mongoose');

// Định nghĩa schema cho Customer model
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Loại bỏ khoảng trắng thừa
  },
  address: {
    type: String,
    trim: true // Loại bỏ khoảng trắng thừa
  },
  phoneNumber: {
    type: String,
    trim: true // Loại bỏ khoảng trắng thừa
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // Giới hạn giá trị cho trường gender
  },
  birthday: {
    type: Date,
  },
  debtCustomer: {
    type: Number,
    default: 0, // Giá trị mặc định
  }
}, {
  timestamps: true // Tự động quản lý `createdAt` và `updatedAt`
});

// Định nghĩa mối quan hệ ảo với Sale model
customerSchema.virtual('sales', {
  ref: 'Sale', // Tham chiếu đến model Sale
  localField: '_id', // Trường địa phương trong Customer
  foreignField: 'customerId' // Trường trong Sale tham chiếu đến Customer
});

// Kích hoạt các trường ảo khi chuyển đổi sang JSON hoặc Object
customerSchema.set('toObject', { virtuals: true });
customerSchema.set('toJSON', { virtuals: true });

// Xuất model Customer
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
