import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true }, // Ensure lowercase email
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
    phonenumber: { type: String },
    gender: { type: String },
    roleId: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;


    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(user.password, salt);

        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
