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

// Middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the salt
        user.password = await bcrypt.hash(user.password, salt);

        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
