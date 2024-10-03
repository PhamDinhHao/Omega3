import Supplier from '../models/supplier';

// Get all suppliers or a single supplier by ID
let getAllSuppliers = (supplierId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let suppliers;
            if (supplierId === 'ALL') {
                suppliers = await Supplier.find().exec(); // Get all suppliers
            } else if (supplierId) {
                suppliers = await Supplier.findById(supplierId).exec(); // Get supplier by ID
            }
            resolve(suppliers);
        } catch (error) {
            reject(error);
        }
    });
};

// Create a new supplier
let createNewSupplier = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newSupplier = new Supplier({
                name: data.name,
                phoneNumber: data.phoneNumber,
                address: data.address,
                email: data.email,
                debtSupplier: data.debtSupplier,
            });
            await newSupplier.save();
            resolve({
                errCode: 0,
                errMessage: 'Supplier created successfully',
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Delete a supplier
let deleteSupplier = (supplierId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const supplier = await Supplier.findById(supplierId).exec();
            if (!supplier) {
                resolve({
                    errCode: 2,
                    errMessage: `The supplier doesn't exist`,
                });
            } else {
                await supplier.remove(); // Use remove() to delete the document
                resolve({
                    errCode: 0,
                    errMessage: `The supplier was deleted`,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Update supplier data
let updateSupplierData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            }
            let supplier = await Supplier.findById(data.id).exec();
            if (supplier) {
                supplier.name = data.name;
                supplier.phoneNumber = data.phoneNumber;
                supplier.address = data.address;
                supplier.email = data.email;
                supplier.debtSupplier = data.debtSupplier;
                await supplier.save();

                resolve({
                    errCode: 0,
                    errMessage: "Supplier updated successfully",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Supplier not found",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

// Get supplier suggestions by name (like query)
let getSupplierSuggestions = async (query) => {
    try {
        const suggestions = await Supplier.find({
            name: { $regex: query, $options: 'i' } // Case-insensitive search
        }).select('id name').exec();
        return suggestions;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllSuppliers,
    createNewSupplier,
    deleteSupplier,
    updateSupplierData,
    getSupplierSuggestions,
};
