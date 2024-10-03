
import categoryService from "../services/categoryService";
let handleGetAllCategory = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            categorys
        })
    }
    let categorys = await categoryService.getAllCategories(id);
    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        categorys
    })
}
let handleCreateNewCategory = async (req, res) => {
    let message = await categoryService.createNewCategory(req.body);

    return res.status(200).json(message);
}
module.exports = {

    handleGetAllCategory: handleGetAllCategory,
    handleCreateNewCategory: handleCreateNewCategory,


}