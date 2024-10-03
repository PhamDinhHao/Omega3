import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    phonenumber: { type: String },
    gender: { type: String },
    roleId: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
