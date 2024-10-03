import bcrypt from 'bcryptjs';
import User from "../models/user";
const salt = bcrypt.genSaltSync(10);

// Create new user
let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      const newUser = new User({
        name: data.name, 
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === '1' ? true : false,
        roleId: data.roleId,
      });

      await newUser.save();
      resolve('User created successfully');
    } catch (error) {
      reject(error);
    }
  });
};

// Hash password
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hash(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

// Get all users
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.find({}).lean(); // Use lean() for better performance when fetching all documents
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user info by ID
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findById(userId).lean(); // Fetch user by ID
      if (user) {
        resolve(user);
      } else {
        resolve(null); // Return null if the user doesn't exist
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
      let user = await User.findById(data.id);

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save(); // Save updated user details
        let allUsers = await User.find({}).lean(); // Fetch all users after update
        resolve(allUsers);
      } else {
        resolve(null); // If user doesn't exist
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Delete user by ID
let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findByIdAndDelete(userId); // Delete user by ID

      if (user) {
        resolve('User deleted successfully');
      } else {
        resolve('User not found');
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};
