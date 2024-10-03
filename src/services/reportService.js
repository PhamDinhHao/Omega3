import moment from "moment";
import SaleDetail from "../models/saleDetail";
import Sale from "../models/sale";
import Purchase from "../models/purchase";

const getTop10ProductBySale = async (filterType, selectedDate, startDate = null, endDate = null) => {
  try {
    selectedDate = moment(selectedDate).toISOString();
    
    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    const result = await SaleDetail.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$productId",
          totalRevenue: { $sum: "$total" }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'products', // Tên collection MongoDB cho Product
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: "$product"
      }
    ]);

    return result.map((item) => ({
      productId: item._id,
      productName: item.product.name,
      totalRevenue: item.totalRevenue
    }));
  } catch (error) {
    console.error("Error fetching top products by sale:", error);
    throw error;
  }
};


const getTop10ProductByQuantity = async (filterType, selectedDate, startDate = null, endDate = null) => {
  try {
    selectedDate = moment(selectedDate).toISOString();

    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    const result = await SaleDetail.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: "$product"
      }
    ]);

    return result.map((item) => ({
      productId: item._id,
      productName: item.product.name,
      totalQuantity: item.totalQuantity
    }));
  } catch (error) {
    console.error("Error fetching top products by quantity:", error);
    throw error;
  }
};


const getTop10CustomersByRevenue = async (filterType, selectedDate, startDate = null, endDate = null) => {
  try {
    selectedDate = moment(selectedDate).toISOString();

    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    const result = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$customerId",
          totalRevenue: { $sum: "$total" }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: "$customer"
      }
    ]);

    return result.map((item) => ({
      customerId: item._id,
      customerName: item.customer.name,
      totalRevenue: item.totalRevenue
    }));
  } catch (error) {
    console.error("Error fetching top customers by revenue:", error);
    throw error;
  }
};


const getTop10SuppliersByRevenue = async (filterType, selectedDate, startDate = null, endDate = null) => {
  try {
    selectedDate = moment(selectedDate).toISOString();

    if (filterType !== "custom") {
      startDate = moment(selectedDate).startOf(filterType).toISOString();
      endDate = moment(selectedDate).endOf(filterType).toISOString();
    } else {
      startDate = moment(startDate).toISOString();
      endDate = moment(endDate).toISOString();
    }

    const result = await Purchase.aggregate([
      {
        $match: {
          purchaseDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$supplierId",
          totalRevenue: { $sum: "$total" }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'suppliers',
          localField: '_id',
          foreignField: '_id',
          as: 'supplier'
        }
      },
      {
        $unwind: "$supplier"
      }
    ]);

    return result.map((item) => ({
      supplierId: item._id,
      supplierName: item.supplier.name,
      totalRevenue: item.totalRevenue
    }));
  } catch (error) {
    console.error("Error fetching top suppliers by revenue:", error);
    throw error;
  }
};



module.exports = {
  getTop10ProductBySale,
  getTop10ProductByQuantity,
  getTop10CustomersByRevenue,
  getTop10SuppliersByRevenue,
};
