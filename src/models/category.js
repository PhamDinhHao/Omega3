'use strict';
const mongoose = require('mongoose');

// Định nghĩa schema cho Category model
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true, // Bắt buộc
    trim: true // Loại bỏ khoảng trắng thừa
  }
}, {
  timestamps: true // Tự động quản lý `createdAt` và `updatedAt`
});

// Định nghĩa mối quan hệ ảo với Product model
categorySchema.virtual('products', {
  ref: 'Product', // Tham chiếu đến model Product
  localField: '_id', // Trường địa phương trong Category
  foreignField: 'categoryId' // Trường trong Product tham chiếu đến Category
});

// Kích hoạt các trường ảo khi chuyển đổi sang JSON hoặc Object
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

// Xuất model Category
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
