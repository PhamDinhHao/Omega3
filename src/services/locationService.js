import { request } from "express";
import Location from "../models/location";

// Get all locations or a specific location by ID
let getAllLocation = (locationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let locations;
      if (locationId === "ALL") {
        locations = await Location.find({}); // Fetch all locations
      } else if (locationId) {
        locations = await Location.findById(locationId); // Fetch a specific location by ID
      }
      resolve(locations);
    } catch (error) {
      reject(error);
    }
  });
};

// Create a new location
let createNewlacation = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newLocation = await Location.create({
        locationName: data.locationName,
        maxWeightCapacity: data.maxWeightCapacity,
      });
      await newLocation.save();
      resolve({
        errCode: 0,
        errMessage: "Location created successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllLocation,
  createNewlacation,
};
