import { request } from "express";
import Product from "../models/product";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Unit from "../models/unit";
import Location from "../models/location";
import PurchaseDetail from "../models/purchaseDetail";
import SaleDetail from "../models/saleDetail";

// Get all products or a specific product by ID
let getAllProducts = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products;
      if (productId === "ALL") {
        products = await Product.find({})
          .populate("supplierId", "name")
          .populate("categoryId", "categoryName")
          .populate("unitId", "unitName")
          .populate("locationId", "locationName");
      } else {
        products = await Product.findById(productId)
          .populate("supplierId", "name")
          .populate("categoryId", "categoryName")
          .populate("unitId", "unitName")
          .populate("locationId", "locationName");
      }
      resolve(products);
    } catch (error) {
      reject(error);
    }
  });
};

// Get sold products data
const handleGetProductDoneSale = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const soldProducts = await SaleDetail.aggregate([
        {
          $group: {
            _id: "$productId",
            totalQuantity: { $sum: "$quantity" },
          },
        },
      ]);
      resolve(soldProducts);
    } catch (error) {
      reject(error);
    }
  });
};

// Create a new product
let createNewProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newProduct = new Product({
        productName: data.productName,
        categoryId: data.selectedCategory.value,
        locationId: data.selectedLocation.value,
        supplierId: data.selectedSupplier.value,
        unitId: data.selectedUnit.value,
        image: data.image,
        quantity: data.quantity,
        description: data.description,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        waitTime: data.waitTime,
      });
      await newProduct.save();
      resolve({ errCode: 0, errMessage: "OK" });
    } catch (error) {
      reject(error);
    }
  });
};

// Delete a product
let deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        resolve({ errCode: 2, errMessage: "Product not found" });
      } else {
        await product.remove();
        resolve({ errCode: 0, errMessage: "Product deleted successfully" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Update product data
let updateProductData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({ errCode: 2, errMessage: "Missing required parameters" });
      }

      const product = await Product.findById(data.id);
      if (product) {
        product.productName = data.productName;
        product.categoryId = data.selectedCategory.value;
        product.supplierId = data.selectedSupplier.value;
        product.unitId = data.selectedUnit.value;
        product.image = data.image;
        product.quantity = data.quantity;
        product.description = data.description;
        product.costPrice = data.costPrice;
        product.salePrice = data.salePrice;
        await product.save();
        resolve({ errCode: 0, errMessage: "Product updated successfully" });
      } else {
        resolve({ errCode: 1, errMessage: "Product not found" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Get product suggestions based on a query
let getProductSuggestions = async (query) => {
  try {
    const suggestions = await Product.find({
      productName: { $regex: query, $options: "i" },
    }).select("id productName quantity costPrice salePrice");
    return suggestions;
  } catch (error) {
    throw error;
  }
};

// Get products in purchase details
let getProductsInPurchaseDetails = async (purchaseId) => {
  try {
    const purchaseDetails = await PurchaseDetail.find({ purchaseId })
      .select("productId quantity costPrice total")
      .lean();

    if (!purchaseDetails || purchaseDetails.length === 0) {
      return { errCode: 2, errMessage: "No purchase details found" };
    }

    const productIds = purchaseDetails.map((detail) => detail.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "id productName"
    );

    const combinedResults = purchaseDetails.map((detail) => {
      const product = products.find((p) => p._id.equals(detail.productId));
      return { ...product, quantity: detail.quantity, total: detail.total };
    });

    return { errCode: 0, data: combinedResults };
  } catch (error) {
    throw error;
  }
};

// Get products in sale details
let getProductsInSaleDetails = async (saleId) => {
  try {
    const saleDetails = await SaleDetail.find({ saleId })
      .select("productId quantity total salePrice")
      .lean();

    if (!saleDetails || saleDetails.length === 0) {
      return { errCode: 2, errMessage: "No sale details found" };
    }

    const productIds = saleDetails.map((detail) => detail.productId);
    const products = await Product.find({ _id: { $in: productIds } }).select(
      "id productName salePrice"
    );

    const combinedResults = saleDetails.map((detail) => {
      const product = products.find((p) => p._id.equals(detail.productId));
      return { ...product, quantity: detail.quantity, total: detail.total };
    });

    return { errCode: 0, data: combinedResults };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProductData,
  deleteProduct,
  getProductSuggestions,
  getProductsInPurchaseDetails,
  handleGetProductDoneSale,
  getProductsInSaleDetails,
};
