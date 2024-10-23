const stockService = require("../services/stockService");

let getAllStockChecks = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      stockChecks: [],
    });
  }
  try {
    let result = await stockService.getAllStockChecks(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      message: "Error from server",
      stockChecks: [],
    });
  }
};

const createNewStockCheck = async (req, res) => {
  try {
    const data = req.body;
    const result = await stockService.createNewStockCheck(data);
    if (result && result.errCode === 0) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Stock Check created successfully",
        stockCheckId: result.stockCheckId, // Assuming the service returns the new stock check ID
      });
    } else {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Error creating Stock Check",
      });
    }
  } catch (error) {
    console.error("Error creating new stock check:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
    });
  }
};

const createNewStockCheckDetail = async (req, res) => {
  // console.log("Incoming data:", req.body);
  try {
    const data = req.body;
    const result = await stockService.createNewStockCheckDetail(data);
    if (result && result.errCode === 0) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Stock Check Detail created successfully",
      });
    } else {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Error creating Stock Check Detail",
      });
    }
  } catch (error) {
    console.error("Error creating new stock check detail:", error);
    return res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
    });
  }
};
let handleDeleteSock = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      stock,
    });
  }
  let message = await stockService.deleteStock(req.body.id);
  return res.status(200).json(message);
};
module.exports = {
  createNewStockCheck,
  createNewStockCheckDetail,
  getAllStockChecks,
  handleDeleteSock
};
