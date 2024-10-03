import productService from "../services/productService";

let handleGetAllProduct = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      products,
    });
  }

  let products = await productService.getAllProducts(id);
  console.log("get all", products)
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    products,
  });
};
let handleGetProductDoneSale = async (req, res) => {
  let productDoneSale = await productService.handleGetProductDoneSale();

  return res.status(200).json({
    errCode: 0,
    message: "ok",
    productDoneSale,
  });
};
let handleCreateNewProduct = async (req, res) => {
  let message = await productService.createNewProduct(req.body);
  return res.status(200).json(message);
};

let handleDeleteProduct = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      products,
    });
  }
  let message = await productService.deleteProduct(req.body.id);
  return res.status(200).json(message);
};

let handleEditProduct = async (req, res) => {
  let data = req.body;
  let message = await productService.updateProductData(data);
  return res.status(200).json(message);
};

let handleGetProductSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Query value:", q);
    const suggestions = await productService.getProductSuggestions(q);
    return res.status(200).json({
      errCode: 0,
      message: "ok",
      suggestions,
    });
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

let handleGetProductsInPurchaseDetails = async (req, res) => {
  try {
    let purchaseId = req.query.purchaseId;
    if (!purchaseId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: purchaseId",
      });
    }

    let listProductByPurchaseId =
      await productService.getProductsInPurchaseDetails(purchaseId);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      data: listProductByPurchaseId,
    });
  } catch (error) {
    console.log("Error in getProductsInPurchaseDetails:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let handleGetProductsInSaleDetails = async (req, res) => {
  try {
    let saleId = req.query.saleId;
    if (!saleId) {
      return res.status(400).json({
        errCode: 1,
        errMessage: "Missing required parameter: purchaseId",
      });
    }

    let listProductBySaleId =
      await productService.getProductsInSaleDetails(saleId);
    return res.status(200).json({
      errCode: 0,
      errMessage: "OK",
      data: listProductBySaleId,
    });
  } catch (error) {
    console.log("Error in getProductsInPurchaseDetails:", error);
    return res.status(500).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  handleGetAllProduct: handleGetAllProduct,
  handleCreateNewProduct: handleCreateNewProduct,
  handleEditProduct: handleEditProduct,
  handleDeleteProduct: handleDeleteProduct,
  handleGetProductSuggestions: handleGetProductSuggestions,
  handleGetProductsInPurchaseDetails: handleGetProductsInPurchaseDetails,
  handleGetProductDoneSale: handleGetProductDoneSale,
  handleGetProductsInSaleDetails: handleGetProductsInSaleDetails
};
