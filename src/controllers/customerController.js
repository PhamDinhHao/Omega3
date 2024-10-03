import customerService from "../services/customerService";
let handleGetAllCustomer = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            customers
        })
    }
    let customers = await customerService.getAllCustomers(id);
    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        customers
    })
}
let handleCreateNewCustomer = async (req, res) => {
    let message = await customerService.createNewCustomer(req.body);

    return res.status(200).json(message);
}
let handleDeleteCustomer = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            customers
        })
    }
    let message = await customerService.deleteCustomer(req.body.id);
    return res.status(200).json(message);
}
let handleEditCustomer = async (req, res) => {
    let data = req.body;
    let message = await customerService.updateCustomerData(data);
    return res.status(200).json(message);

}


let handleGetCustomerSuggestions = async (req, res) => {
    try {
        const q = req.query;

        const suggestions = await customerService.getCustomerSuggestions(q[0]);
        return res.status(200).json({
            errCode: 0,
            message: "ok",
            suggestions,
        });
    } catch (error) {
        console.error("Error fetching customer suggestions:", error);
        return res.status(500).json({
            errCode: 1,
            message: "Internal server error",
        });
    }
};

module.exports = {

    handleGetAllCustomer: handleGetAllCustomer,
    handleCreateNewCustomer: handleCreateNewCustomer,
    handleEditCustomer: handleEditCustomer,
    handleDeleteCustomer: handleDeleteCustomer,
    handleGetCustomerSuggestions: handleGetCustomerSuggestions


}