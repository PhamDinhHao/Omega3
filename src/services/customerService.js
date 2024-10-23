import { request } from "express";
import Customer from "../models/customer";

let getAllCustomers = (customerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let customers;
      if (customerId === "ALL") {
        customers = await Customer.find({});
      } else if (customerId) {
        customers = await Customer.findById(customerId);
      }
      resolve(customers);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewCustomer = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newCustomer = new Customer({
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        email: data.email,
        gender: data.gender,
        birthday: data.birthday,
        debtCustomer: data.debtCustomer,
      });

      await newCustomer.save();
      resolve({
        errCode: 0,
        errMessage: "Customer created successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let deleteCustomer = (customerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer = await Customer.findById(customerId);

      if (!customer) {
        resolve({
          errCode: 2,
          errMessage: `The customer doesn't exist`,
        });
      } else {
        await Customer.findByIdAndDelete(customerId);

        resolve({
          errCode: 0,
          errMessage: `The customer is deleted`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateCustomerData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      }

      let customer = await Customer.findById(data.id);

      if (customer) {
        customer.name = data.name;
        customer.phoneNumber = data.phoneNumber;
        customer.address = data.address;
        customer.email = data.email;
        customer.debtCustomer = data.debtCustomer;
        customer.gender = data.gender;
        customer.birthday = data.birthday;

        await customer.save();

        resolve({
          errCode: 0,
          errMessage: "Customer updated successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Customer not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getCustomerSuggestions = async (query) => {
  try {
    const suggestions = await Customer.find({
      name: { $regex: query, $options: "i" },
    })
      .select("id name")
      .limit(10);
      
    return suggestions;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCustomers,
  createNewCustomer,
  deleteCustomer,
  updateCustomerData,
  getCustomerSuggestions,
};
