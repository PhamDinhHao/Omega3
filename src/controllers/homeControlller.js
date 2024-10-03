import User from "../models/user"; // Đảm bảo import đúng mô hình Mongoose
import CRUDService from "../services/CRUDService";

let getHomepage = async (req, res) => {
    try {
        let data = await User.find(); // Sử dụng Mongoose để tìm tất cả người dùng
        console.log('---------------');
        console.log(data);
        console.log('---------------');
        return res.render('homepage.ejs', { users: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

let getCRUD = async (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    // Kiểm tra xem trường name có tồn tại không
    if (!req.body.name) {
        return res.status(400).send('Name is required');
    }

    let message = await CRUDService.createNewUser(req.body);
    return res.send('post crud');
}


let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userid = req.query.id;
    if (userid) {
        let userData = await CRUDService.getUserInfoById(userid);
        return res.render('editCRUD.ejs', {
            user: userData
        });
    } else {
        return res.send('heello edit');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('Delete the user succeed!');
    } else {
        return res.send('Users not found!');
    }
}

export default {
    getHomepage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};
