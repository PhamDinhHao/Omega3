import Sale from '../models/sale';
import SaleDetail from '../models/saleDetail';
import Product from '../models/product';
import Customer from '../models/customer'; // Assuming you have a Customer model
// Create a new sale
let deleteSale = (saleId) => {
  return new Promise(async (resolve, reject) => {
      try {
          const sale = await Sale.findById(saleId).exec();
          if (!sale) {
              resolve({
                  errCode: 2,
                  errMessage: `The supplier doesn't exist`,
              });
          } else {
              await Sale.findByIdAndDelete(saleId);
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
let createNewSale = async (data) => {
  try {
    const newSale = await Sale.create({
      saleDate: data.saleDate,
      customerId: data.customerId,
      total: data.total
    });

    return {
      errCode: 0,
      errMessage: "OK",
      saleId: newSale._id,
    };
  } catch (error) {
    console.error("Error creating new sale:", error);
    return {
      errCode: 1,
      errMessage: "Error creating new sale",
    };
  }
};

// Create a new sale detail and update product quantity
let createNewSaleDetail = async (data) => {
  try {
    const newSaleDetail = await SaleDetail.create({
      productId: data.productId,
      saleId: data.saleId,
      quantity: data.quantity,
      salePrice: data.salePrice,
      total: data.total,
    });

    const product = await Product.findById(data.productId);
    if (!product) {
      return {
        errCode: 1,
        errMessage: "Product not found",
      };
    }

    // Update product quantity
    const newQuantity = product.quantity - data.quantity;
    if (newQuantity >= 0) {
      product.quantity = newQuantity;
      await product.save();

      return {
        errCode: 0,
        errMessage: "Sale detail created successfully",
        newSaleDetail,
      };
    } else {
      const sale = await Sale.findById(data.saleId);
      if (sale) {
        await sale.remove(); // Remove the sale if the quantity exceeds available stock
        return {
          errCode: 3,
          errMessage: "The sale was deleted due to insufficient stock",
        };
      }
      return {
        errCode: 2,
        errMessage: "Sale not found",
      };
    }
  } catch (error) {
    console.error("Error creating new sale detail:", error);
    return {
      errCode: 1,
      errMessage: "Error creating new sale detail",
    };
  }
};

// Get total sales by day for the past 7 days
const getTotalSalesByDay = async () => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const salesByDay = await Sale.aggregate([
      {
        $match: { saleDate: { $gte: startDate } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          totalSales: { $sum: "$total" },
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
      const found = salesByDay.find(sale => sale._id === date);
      return {
        date,
        totalSales: found ? found.totalSales : 0
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching total sales by day:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching total sales by day",
    };
  }
};

// Get total sales by month for the past year
const getTotalSalesByMonth = async () => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);

    const salesByMonth = await Sale.aggregate([
      {
        $match: { saleDate: { $gte: startDate } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$saleDate" } },
          totalSales: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateRange = [];
    const currentDate = new Date();
    currentDate.setDate(1); // Set to the first day of the current month
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      dateRange.push(date.toISOString().slice(0, 7));
    }
    dateRange.reverse();

    const result = dateRange.map(month => {
      const found = salesByMonth.find(sale => sale._id === month);
      return {
        month,
        totalSales: found ? found.totalSales : 0
      };
    });

    return {
      errCode: 0,
      errMessage: "OK",
      data: result,
    };
  } catch (error) {
    console.error("Error fetching total sales by month:", error);
    return {
      errCode: 1,
      errMessage: "Error fetching total sales by month",
    };
  }
};

// Get all sales or a specific sale by ID
let getAllSale = async (saleId) => {
  try {
    let sales;
    if (!saleId || saleId === "ALL") {
      sales = await Sale.find().populate('customerId', 'name').exec();
    } else {
      sales = await Sale.findById(saleId).populate('customerId', 'name').exec();
    }
    return sales;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};

// Edit a sale and its details
let EditSaleAndDetails = async (sale, saleDetails) => {
  try {
    // Update Sale
    await Sale.updateOne({ _id: sale.saleId }, { customerId: sale.customerId, total: sale.total });

    const existingDetails = await SaleDetail.find({ saleId: sale.saleId }).lean();

    const detailsToUpdate = [];
    const detailsToCreate = [];
    const detailsToDelete = [];

    const existingDetailMap = new Map(existingDetails.map(detail => [detail.productId.toString(), detail]));

    // Identify details to update, create, or delete
    for (let detail of saleDetails) {
      if (existingDetailMap.has(detail.productId)) {
        const existingDetail = existingDetailMap.get(detail.productId);
        detailsToUpdate.push({ ...detail, oldQuantity: existingDetail.quantity, id: existingDetail._id });
        existingDetailMap.delete(detail.productId);
      } else {
        detailsToCreate.push(detail);
      }
    }
    for (let detail of existingDetailMap.values()) {
      detailsToDelete.push(detail);
    }

    // Process updates, creates, and deletes
    for (let detail of detailsToUpdate) {
      const product = await Product.findById(detail.productId);
      const quantityDiff = detail.quantity - detail.oldQuantity;
      product.quantity += quantityDiff;
      await product.save();
      await SaleDetail.updateOne({ _id: detail.id }, detail);
    }

    for (let detail of detailsToCreate) {
      const product = await Product.findById(detail.productId);
      product.quantity -= detail.quantity;
      await product.save();
      await SaleDetail.create(detail);
    }

    for (let detail of detailsToDelete) {
      const product = await Product.findById(detail.productId);
      product.quantity += detail.quantity;
      await product.save();
      await SaleDetail.deleteOne({ _id: detail._id });
    }

    return {
      errCode: 0,
      errMessage: "Sale and details updated successfully",
    };
  } catch (error) {
    console.error("Error editing sale and details:", error);
    return {
      errCode: 1,
      errMessage: "Error editing sale and details",
    };
  }
};
module.exports = {
  EditSaleAndDetails,getAllSale,getTotalSalesByMonth,getTotalSalesByDay,createNewSaleDetail,createNewSale,deleteSale
  };