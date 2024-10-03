import bcrypt from 'bcryptjs';
import User from '../models/user'; // Assuming the User model is in the models directory

const salt = bcrypt.genSaltSync(10);

// Handle user login
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let user = await User.findOne({ email }).exec();
            if (user) {
                let check = bcrypt.compareSync(password, user.password);
                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = "Ok";
                    userData.user = { ...user._doc, password: undefined }; // Exclude password
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Wrong password";
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = "User not found";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

// Check if user email exists
let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ email }).exec();
            resolve(!!user);
        } catch (error) {
            reject(error);
        }
    });
};

// Get all users or a single user by ID
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users;
            if (userId === 'ALL') {
                users = await User.find({}, { password: 0 }).exec(); // Exclude password
            } else {
                users = await User.findById(userId, { password: 0 }).exec(); // Exclude password
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

// Create a new user
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in use, please try another email'
                });
            } else {
                let hashPassword = await bcrypt.hash(data.password, salt);
                const newUser = new User({
                    email: data.email,
                    password: hashPassword,
                    name: data.name,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                });
                await newUser.save();
                resolve({ errCode: 0, errMessage: 'User created successfully' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Delete a user by ID
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findById(userId).exec();
            if (!user) {
                resolve({ errCode: 2, errMessage: "User doesn't exist" });
            } else {
                await user.remove();
                resolve({ errCode: 0, errMessage: "User deleted successfully" });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Update user data
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({ errCode: 2, errMessage: "Missing required parameter" });
                return;
            }
            let user = await User.findById(data.id).exec();
            if (user) {
                user.name = data.name;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                await user.save();
                resolve({ errCode: 0, errMessage: 'User updated successfully' });
            } else {
                resolve({ errCode: 1, errMessage: 'User not found' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Update user password
let updatePasswordUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ email: data.email }).exec();
            if (user) {
                let hashPassword = await bcrypt.hash(data.password, salt);
                user.password = hashPassword;
                await user.save();
                resolve({ errCode: 0, errMessage: 'Password updated successfully' });
            } else {
                resolve({ errCode: 1, errMessage: 'User not found' });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    updatePasswordUserData,
    checkUserEmail,
};
