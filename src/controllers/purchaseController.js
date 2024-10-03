import purchaseService from "../services/purchaseService";

let handleCreateNewPurchase = async (req, res) => {
  let message = await purchaseService.createNewPurchase(req.body);

  return res.status(200).json(message);
};

let handleCreateNewPurchaseDetail = async (req, res) => {
  try {
    const requestData = req.body;
    let message = await purchaseService.createNewPurchaseDetail(requestData);
    return res.status(200).json(message);
  } catch (error) {
    console.error("Error creating new purchase detail:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

let handleGetAllPurchase = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      purchases,
    });
  }
  let purchases = await purchaseService.getAllPurchase(id);
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    purchases,
  });
};

let handleEditPurchaseAndDetails = async (req, res) => {
  try {
    const { purchase, purchaseDetails } = req.body;
    // console.log("Received data:", { purchase, purchaseDetails });
    let response = await purchaseService.EditPurchaseAndDetails(
      purchase,
      purchaseDetails
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in updatePurchaseAndDetails:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Error updating purchase and details",
    });
  }
};
let getTotalPurchasesByDay = async (req, res) => {
  try {
    const result = await purchaseService.getTotalPurchasesByDay();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
    });
  }
};
let getTotalPurchasesByMonth = async (req, res) => {
  try {
    const result = await purchaseService.getTotalPurchasesByMonth();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      errCode: 1,
      errMessage: "Internal server error",
    });
  }
};
module.exports = {
  handleCreateNewPurchase: handleCreateNewPurchase,
  handleCreateNewPurchaseDetail: handleCreateNewPurchaseDetail,
  handleGetAllPurchase: handleGetAllPurchase,
  handleEditPurchaseAndDetails: handleEditPurchaseAndDetails,
  getTotalPurchasesByDay: getTotalPurchasesByDay,
  getTotalPurchasesByMonth: getTotalPurchasesByMonth
};
