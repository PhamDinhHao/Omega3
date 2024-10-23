import saleService from "../services/saleService";

let handleDeleteSale = async (req, res) => {
    if (!req.body.id) {
      return res.status(200).json({
        errCode: 1,
        message: "Missing required parameters",
        sale,
      });
    }
    let message = await saleService.deleteSale(req.body.id);
    return res.status(200).json(message);
  };

let handleCreateNewSale = async (req, res) => {
    let message = await saleService.createNewSale(req.body);

    return res.status(200).json(message);
};

let handleCreateNewSaleDetail = async (req, res) => {
    try {
        const requestData = req.body;
        let message = await saleService.createNewSaleDetail(requestData);
        return res.status(200).json(message);
    } catch (error) {
        console.error("Error creating new sale detail:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
let handleGetAllSale = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameters",
            Sales,
        });
    }
    let Sales = await saleService.getAllSale(id);
    return res.status(200).json({
        errCode: 0,
        message: "ok",
        Sales,
    });
};

let handleEditSaleAndDetails = async (req, res) => {
    try {
        const { Sale, SaleDetails } = req.body;

        // console.log("Received data:", { Sale, SaleDetails });
        let response = await saleService.EditSaleAndDetails(
            Sale,
            SaleDetails
        );

        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in updateSaleAndDetails:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Error updating Sale and details",
        });
    }
};
let getTotalSalesByDay = async (req, res) => {
    try {
        const result = await saleService.getTotalSalesByDay();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error",
        });
    }
};

let getTotalSalesByMonth = async (req, res) => {
    try {
        const result = await saleService.getTotalSalesByMonth();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            errCode: 1,
            errMessage: "Internal server error",
        });
    }
};
module.exports = {
    handleCreateNewSale: handleCreateNewSale,
    handleCreateNewSaleDetail: handleCreateNewSaleDetail,
    getTotalSalesByDay: getTotalSalesByDay,
    getTotalSalesByMonth: getTotalSalesByMonth,
    handleGetAllSale: handleGetAllSale,
    handleEditSaleAndDetails: handleEditSaleAndDetails,
    handleDeleteSale
};
