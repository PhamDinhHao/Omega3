import express from "express";
import homeController from "../controllers/homeControlller";
import userController from "../controllers/userController";
import supplierController from "../controllers/supplierController";
import customerController from "../controllers/customerController";
import productController from "../controllers/productController";
import categoryController from "../controllers/categoryController";
import locationController from "../controllers/locationController";
import unitController from "../controllers/unitController";
import purchaseController from "../controllers/purchaseController";
import saleController from "../controllers/saleController";
import sendOtpEmail from "./sendEmail.js";
import stockController from "../controllers/stockController.js";
import {
  create_confirm_otp,
  read_confirm_otp,
  deleteExpiredRecords,
  deleteExpiredRecordNow,
} from "../controllers/otp.js";
import reportController from "../controllers/reportController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomepage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/hao", (req, res) => {
    return res.send("Hello World ban Hao");
  });
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.put("/api/edit-user-password", userController.updatePasswordUserData);
  router.post("/api/check-email", userController.checkUserEmail);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  router.get("/api/get-all-supplier", supplierController.handleGetAllSupplier);
  router.post(
    "/api/create-new-supplier",
    supplierController.handleCreateNewSupplier
  );
  router.put("/api/edit-supplier", supplierController.handleEditSupplier);
  router.delete(
    "/api/delete-supplier",
    supplierController.handleDeleteSupplier
  );
  router.get(
    "/api/get-supplier-suggestion",
    supplierController.handleGetSupplierSuggestions
  );

  router.get("/api/get-all-customer", customerController.handleGetAllCustomer);
  router.post(
    "/api/create-new-customer",
    customerController.handleCreateNewCustomer
  );
  router.put("/api/edit-customer", customerController.handleEditCustomer);
  router.delete(
    "/api/delete-customer",
    customerController.handleDeleteCustomer
  );
  router.get(
    "/api/get-customer-suggestion",
    customerController.handleGetCustomerSuggestions
  );

  router.get("/api/get-all-product", productController.handleGetAllProduct);
  router.post(
    "/api/create-new-product",
    productController.handleCreateNewProduct
  );

  router.get(
    "/api/get-product-done-sale",
    productController.handleGetProductDoneSale
  );
  router.put("/api/edit-product", productController.handleEditProduct);
  router.delete("/api/delete-product", productController.handleDeleteProduct);
  router.get(
    "/api/get-product-suggestion",
    productController.handleGetProductSuggestions
  );
  router.get(
    "/api/get-product-by-purchaseid",
    productController.handleGetProductsInPurchaseDetails
  );
  router.get(
    "/api/get-product-by-saleId",
    productController.handleGetProductsInSaleDetails
  );

  router.get("/api/allcode", userController.getAllCode);

  router.get("/api/get-all-category", categoryController.handleGetAllCategory);
  router.post(
    "/api/create-new-category",
    categoryController.handleCreateNewCategory
  );
  router.get("/api/get-all-location", locationController.handleGetAlllacation);
  router.post(
    "/api/create-new-location",
    locationController.handleCreateNewlacation
  );

  router.post(
    "/api/create-new-purchase",
    purchaseController.handleCreateNewPurchase
  );
  router.post(
    "/api/create-new-purchase-detail",
    purchaseController.handleCreateNewPurchaseDetail
  );
  router.get("/api/get-all-purchase", purchaseController.handleGetAllPurchase);
  router.delete("/api/delete-purchase", purchaseController.handleDeletePurchase);
  router.put(
    "/api/edit-purchase-and-details",
    purchaseController.handleEditPurchaseAndDetails
  );

  router.get("/api/get-all-unit", unitController.handleGetAllUnit);
  router.post("/api/create-new-unit", unitController.handleCreateNewUnit);

  router.post("/api/create-new-sale", saleController.handleCreateNewSale);
  router.delete("/api/delete-sale", saleController.handleDeleteSale);
  router.post(
    "/api/create-new-sale-detail",
    saleController.handleCreateNewSaleDetail
  );
  router.get("/api/get-all-sale", saleController.handleGetAllSale);
  router.put(
    "/api/edit-sale-and-details",
    saleController.handleEditSaleAndDetails
  );
  router.get("/api/total-sales-by-day", saleController.getTotalSalesByDay);

  router.get("/api/total-sales-by-mon", saleController.getTotalSalesByMonth);
  router.get(
    "/api/total-purchase-by-mon",
    purchaseController.getTotalPurchasesByMonth
  );
  router.get(
    "/api/total-purchase-by-day",
    purchaseController.getTotalPurchasesByDay
  );
  router.post("/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      const result = await read_confirm_otp(email, otp);
      if (result.success === true) {
        await deleteExpiredRecordNow(email);
        res
          .status(200)
          .json({ success: result.success, message: result.message });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  });
  router.post("/send-otp-email", async (req, res) => {
    try {
      const { email } = req.body;

      const otp = Math.floor(100000 + Math.random() * 900000);
      const result = await create_confirm_otp(email, otp.toString());
      const emailSent = await sendOtpEmail(email, otp.toString());
      if (emailSent) {
        let timeout;
        timeout = setTimeout(() => {
          deleteExpiredRecords(email);
          clearTimeout(timeout);
        }, 1 * 6000);
      }
      if (!emailSent) {
        throw new Error("Failed to send OTP email.");
      }
      res.status(200).json({ message: result.message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal Server Error" });
    }
  });
  router.get("/api/total-sales-by-day", saleController.getTotalSalesByDay);
  router.get("/api/total-sales-by-mon", saleController.getTotalSalesByMonth);
  router.get(
    "/api/total-purchase-by-mon",
    purchaseController.getTotalPurchasesByMonth
  );
  router.get(
    "/api/total-purchase-by-day",
    purchaseController.getTotalPurchasesByDay
  );

  router.get(
    "/api/top-10-sale-product-revenue",
    reportController.getTop10SaleProductRevenue
  );
  router.get(
    "/api/top-10-sale-product-quantity",
    reportController.getTop10SaleProductQuantity
  );
  router.get(
    "/api/top-10-customer-revenue",
    reportController.getTop10CustomerRevenue
  );
  router.get(
    "/api/top-10-supplier-revenue",
    reportController.getTop10SupplierRevenue
  );

  router.post(
    "/api/create-new-stock-check",
    stockController.createNewStockCheck
  );
  router.post(
    "/api/create-new-stock-check-detail",
    stockController.createNewStockCheckDetail
  );
  router.get("/api/get-all-stock-check", stockController.getAllStockChecks);
  return app.use("/", router);
};
module.exports = initWebRoutes;
