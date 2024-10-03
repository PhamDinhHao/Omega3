import reportService from "../services/reportService";

const getTop10SaleProductRevenue = async (req, res) => {
  try {
    const { filterType, selectedDate, startDate, endDate } = req.query;
    // console.log("Received filterType in backend:", filterType);
    const topProducts = await reportService.getTop10ProductBySale(
      filterType,
      selectedDate,
      startDate,
      endDate
    );
    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTop10SaleProductQuantity = async (req, res) => {
  try {
    const { filterType, selectedDate, startDate, endDate } = req.query;
    const topProducts = await reportService.getTop10ProductByQuantity(
      filterType,
      selectedDate,
      startDate,
      endDate
    );
    res.json(topProducts);
    // console.log("aâ", topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTop10CustomerRevenue = async (req, res) => {
  try {
    const { filterType, selectedDate, startDate, endDate } = req.query;
    const customers = await reportService.getTop10CustomersByRevenue(
      filterType,
      selectedDate,
      startDate,
      endDate
    );
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching top customers by revenue:", error);
    res.status(500).json({ error: "Failed to fetch top customers by revenue" });
  }
};

const getTop10SupplierRevenue = async (req, res) => {
  try {
    const { filterType, selectedDate, startDate, endDate } = req.query;
    const suppliers = await reportService.getTop10SuppliersByRevenue(
      filterType,
      selectedDate,
      startDate,
      endDate
    );
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top suppliers by revenue" });
  }
};

module.exports = {
  getTop10SaleProductRevenue: getTop10SaleProductRevenue,
  getTop10SaleProductQuantity: getTop10SaleProductQuantity,
  getTop10CustomerRevenue: getTop10CustomerRevenue,
  getTop10SupplierRevenue: getTop10SupplierRevenue,
};
