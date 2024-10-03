
import unitService from "../services/unitService";
let handleGetAllUnit = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            units
        })
    }
    let units = await unitService.getAllUnits(id);
    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        units
    })
}
let handleCreateNewUnit = async (req, res) => {
    let message = await unitService.createNewUnit(req.body);

    return res.status(200).json(message);
}
module.exports = {

    handleGetAllUnit: handleGetAllUnit,
    handleCreateNewUnit: handleCreateNewUnit,


}