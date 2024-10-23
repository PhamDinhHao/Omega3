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
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const purchaseByDay = await Purchase.aggregate([
      {
        $match: { purchaseDate: { $gte: startDate } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          totalPurchases: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateRange = [];
    const endDate = new Date();
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      dateRange.push(date.toISOString().split('T')[0]);
    }

    const result = dateRange.map(date => {
      const found = purchaseByDay.find(purchase => purchase._id === date);
      return {
        date,
        totalPurchases: found ? found.totalPurchases : 0
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching total purchases by day:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching total purchases by day",
    };
  }
};

let getTotalPurchasesByMonth = async () => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);

    const totalPurchasesByMonth = await Purchase.aggregate([
      { $match: { purchaseDate: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$purchaseDate" } },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateRange = [];
    const currentDate = new Date();
    currentDate.setDate(1);
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      dateRange.push(date.toISOString().slice(0, 7));
    }
    dateRange.reverse();


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
    console.error("Error fetching total purchases by month:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching total purchases by month",
    };
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
