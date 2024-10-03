import Unit from '../models/unit'; // Assuming the Unit model is in the models directory

// Get all units or a single unit by ID
let getAllUnits = (unitId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let units;
            if (unitId === 'ALL') {
                units = await Unit.find().exec(); // Retrieve all units
            } else if (unitId) {
                units = await Unit.findById(unitId).exec(); // Retrieve unit by ID
            }
            resolve(units);
        } catch (error) {
            reject(error);
        }
    });
};

// Create a new unit
let createNewUnit = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newUnit = new Unit({
                unitName: data.name,
            });
            await newUnit.save();
            resolve({
                errCode: 0,
                errMessage: 'Unit created successfully',
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllUnits,
    createNewUnit,
};
