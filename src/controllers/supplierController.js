import supplierService from "../services/supplierService";
let handleGetAllSupplier = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      suppliers,
    });
  }
  let suppliers = await supplierService.getAllSuppliers(id);
  return res.status(200).json({
    errCode: 0,
    message: "ok",
    suppliers,
  });
};
let handleCreateNewSupplier = async (req, res) => {
  let message = await supplierService.createNewSupplier(req.body);

  return res.status(200).json(message);
};
let handleDeleteSupplier = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters",
      suppliers,
    });
  }
  let message = await supplierService.deleteSupplier(req.body.id);
  return res.status(200).json(message);
};
let handleEditSupplier = async (req, res) => {
  let data = req.body;
  let message = await supplierService.updateSupplierData(data);
  return res.status(200).json(message);
};

let handleGetSupplierSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    const suggestions = await supplierService.getSupplierSuggestions(q);
    return res.status(200).json({
      errCode: 0,
      message: "ok",
      suggestions,
    });
  } catch (error) {
    console.error("Error fetching supplier suggestions:", error);
    return res.status(500).json({
      errCode: 1,
      message: "Internal server error",
    });
  }
};

module.exports = {
  handleGetAllSupplier: handleGetAllSupplier,
  handleCreateNewSupplier: handleCreateNewSupplier,
  handleEditSupplier: handleEditSupplier,
  handleDeleteSupplier: handleDeleteSupplier,
  handleGetSupplierSuggestions: handleGetSupplierSuggestions,
};
