import Purchase from "../models/purchase"
import Product from "../models/product"
import PurchaseDetail from "../models/purchaseDetail"

let deletePurchase = (purchaseId) => {
  return new Promise(async (resolve, reject) => {
      try {
          const purchase = await Purchase.findById(purchaseId).exec();
          if (!purchase) {
              resolve({
                  errCode: 2,
                  errMessage: `The supplier doesn't exist`,
              });
          } else {
              await Purchase.findByIdAndDelete(purchaseId);
              resolve({
                  errCode: 0,
                  errMessage: `The supplier was deleted`,
              });
          }
      } catch (error) {
          reject(error);
      }
  });
};
let createNewPurchase = async (data) => {
  try {
    const newPurchase = await Purchase.create({
      purchaseDate: data.purchaseDate,
      supplierId: data.supplierId,
      total: data.total,
    });

    return {
      errCode: 0,
      errMessage: "OK",
      purchaseId: newPurchase._id,
    };
  } catch (error) {
    throw error;
  }
};


let createNewPurchaseDetail = async (data) => {
  try {
    const newPurchaseDetail = await PurchaseDetail.create({
      productId: data.productId,
      purchaseId: data.purchaseId,
      quantity: data.quantity,
      costPrice: data.costPrice,
      total: data.total,
    });

    const product = await Product.findById(data.productId);

    if (!product) {
      return {
        errCode: 1,
        errMessage: "Product not found",
      };
    }

    product.quantity += data.quantity;
    await product.save();

    return {
      errCode: 0,
      errMessage: "Purchase detail created successfully",
      purchaseDetail: newPurchaseDetail.toJSON(),
    };
  } catch (error) {
    throw error;
  }
};


let getAllPurchase = async (purchaseId) => {
  try {
    let purchases;
    if (purchaseId === "ALL" || !purchaseId) {
      purchases = await Purchase.find().populate('supplierId', 'name');
    } else {
      purchases = await Purchase.findById(purchaseId).populate('supplierId', 'name');
    }

    return purchases;
  } catch (error) {
    throw error;
  }
};


let EditPurchaseAndDetails = async (purchase, purchaseDetails) => {
  try {

    await Purchase.updateOne({ _id: purchase.purchaseId }, { supplierId: purchase.supplierId, total: purchase.total });
    const existingDetails = await PurchaseDetail.find({ purchaseId: purchase.purchaseId }).lean();
    const existingDetailMap = {};
    existingDetails.forEach((detail) => {
      existingDetailMap[detail.productId] = detail;
    });

    const detailsToUpdate = [];
    const detailsToCreate = [];
    const detailsToDelete = [];

    purchaseDetails.forEach((detail) => {
      if (existingDetailMap[detail.productId]) {
        detailsToUpdate.push({ ...detail, oldQuantity: existingDetailMap[detail.productId].quantity });
        delete existingDetailMap[detail.productId];
      } else {
        detailsToCreate.push(detail);
      }
    });

    for (let productId in existingDetailMap) {
      detailsToDelete.push(existingDetailMap[productId]);
    }

    // Update existing details
    for (let detail of detailsToUpdate) {
      const product = await Product.findById(detail.productId);
      if (product) {
        const quantityDiff = detail.quantity - detail.oldQuantity;
        product.quantity += quantityDiff;
        await product.save();
      }

      await PurchaseDetail.findByIdAndUpdate(detail.id, {
        quantity: detail.quantity,
        costPrice: detail.costPrice,
        total: detail.total,
      });
    }

    // Create new details
    for (let detail of detailsToCreate) {
      const product = await Product.findById(detail.productId);
      if (product) {
        product.quantity += detail.quantity;
        await product.save();
      }

      await PurchaseDetail.create({
        purchaseId: detail.purchaseId,
        productId: detail.productId,
        quantity: detail.quantity,
        costPrice: detail.costPrice,
        total: detail.total,
      });
    }

    // Delete old details
    for (let detail of detailsToDelete) {
      const product = await Product.findById(detail.productId);
      if (product) {
        product.quantity -= detail.quantity;
        await product.save();
      }

      await PurchaseDetail.findByIdAndDelete(detail.id);
    }

    return {
      errCode: 0,
      message: "Update successful",
    };
  } catch (error) {
    throw error;
  }
};


const getStartDate = () => {
  const currentDate = new Date();
  return new Date(currentDate.setDate(currentDate.getDate() - 7));
};

let getTotalPurchasesByDay = async () => {
  try {
    const startDate = getStartDate();
    const endDate = new Date();

    const totalPurchasesByDay = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } }, total: { $sum: "$total" } } },
      { $sort: { "_id": 1 } },
    ]);

    const dateRange = getDateRange(startDate, endDate);
    const result = dateRange.map((date) => {
      const found = totalPurchasesByDay.find(purchase => purchase._id === date);
      return {
        date,
        totalPurchases: found ? found.total : 0,
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

const getCurrentMonth = () => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1); // Corrected to get the current month
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
};

const getStartDateMon = () => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 11); // Corrected to get the starting month 11 months back
  return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
};

let getTotalPurchasesByMonth = async () => {
  try {
    const startDate = getStartDateMon();
    const endDate = getCurrentMonth();

    const totalPurchasesByMonth = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$purchaseDate" } }, total: { $sum: "$total" } } },
      { $sort: { "_id": 1 } },
    ]);

    const dateRange = getMonthRange(startDate, endDate);
    const result = dateRange.map((month) => {
      const found = totalPurchasesByMonth.find(purchase => purchase._id === month);
      return {
        month,
        totalPurchases: found ? found.total : 0,
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewPurchase: createNewPurchase,
  createNewPurchaseDetail: createNewPurchaseDetail,
  getAllPurchase: getAllPurchase,
  EditPurchaseAndDetails: EditPurchaseAndDetails,
  getTotalPurchasesByDay: getTotalPurchasesByDay,
  getTotalPurchasesByMonth: getTotalPurchasesByMonth,
  deletePurchase
};
