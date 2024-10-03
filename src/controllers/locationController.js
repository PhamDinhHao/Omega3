
import locationService from "../services/locationService"
let handleGetAlllacation = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            lacations
        })
    }
    let lacations = await locationService.getAllLocation(id);
    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        lacations
    })
}
let handleCreateNewlacation = async (req, res) => {
    let message = await locationService.createNewlacation(req.body);

    return res.status(200).json(message);
}
module.exports = {

    handleGetAlllacation: handleGetAlllacation,
    handleCreateNewlacation: handleCreateNewlacation,


}