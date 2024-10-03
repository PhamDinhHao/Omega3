import Category from "../models/category";

// Get all categories or a single category by ID
let getAllCategories = (categoryId) => {
  console.log(categoryId);
  return new Promise(async (resolve, reject) => {
    try {
      let categories = '';
      if (categoryId === 'ALL') {
        categories = await Category.find({}).lean(); // Fetch all categories
      } else if (categoryId) {
        categories = await Category.findById(categoryId).lean(); // Fetch a single category by ID
      }
      resolve(categories);
    } catch (error) {
      reject(error);
    }
  });
};

// Create a new category
let createNewCategory = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newCategory = new Category({
        categoryName: data.name,
      });

      await newCategory.save(); // Save the new category
      resolve({
        errCode: 0,
        errMessage: 'Category created successfully',
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllCategories,
  createNewCategory,
};
