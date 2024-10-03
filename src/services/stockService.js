import StockCheck from '../models/stockCheck';
import StockCheckDetail from '../models/stockCheckDetail';
import Product from '../models/product';

// Get all stock checks or a single stock check by ID
let getAllStockChecks = (stockCheckId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let stockChecks;
      if (stockCheckId === "ALL" || !stockCheckId) {
        stockChecks = await StockCheck.find().select('-createdAt -updatedAt').exec(); // Get all stock checks
      } else {
        stockChecks = await StockCheck.findById(stockCheckId).select('-createdAt -updatedAt').exec(); // Get stock check by ID
      }
      resolve({
        errCode: 0,
        message: "OK",
        stockChecks,
      });
    } catch (error) {
      reject({
        errCode: 1,
        message: "Error from server",
      });
    }
  });
};

// Create a new stock check
const createNewStockCheck = async (data) => {
  try {
    // Create a new stock check in MongoDB
    const newStockCheck = await StockCheck.create({
      checkDate: data.checkDate,
      totalActualQuantity: data.totalActualQuantity,
      totalActualMoney: data.totalActualMoney,
      totalMoneyDifference: data.totalMoneyDifference,
      note: data.note,
    });

    return {
      errCode: 0,
      stockCheckId: newStockCheck._id, // Return the new stock check ID
    };
  } catch (error) {
    console.error("Error creating new stock check:", error);
    return {
      errCode: 1,
      errMessage: "Error creating new stock check",
    };
  }
};

// Create a new stock check detail and update product quantity
const createNewStockCheckDetail = async (data) => {
  try {
    // Create a new stock check detail
    const newStockCheckDetail = await StockCheckDetail.create({
      stockCheckId: data.stockCheckId,
      productId: data.productId,
      actualQuantity: data.actualQuantity,
      quantityDifference: data.quantityDifference,
      moneyDifference: data.moneyDifference,
    });

    // Update the product quantity in MongoDB
    const product = await Product.findById(data.productId).exec();
    if (product) {
      product.quantity = data.actualQuantity;
      await product.save();
    }

    return {
      errCode: 0,
      message: "Stock check detail created and product quantity updated",
    };
  } catch (error) {
    console.error("Error creating new stock check detail:", error);
    return {
      errCode: 1,
      errMessage: "Error creating new stock check detail",
    };
  }
};

module.exports = {
  createNewStockCheck,
  createNewStockCheckDetail,
  getAllStockChecks,
};
