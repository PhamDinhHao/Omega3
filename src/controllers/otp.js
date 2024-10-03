import mongoose from 'mongoose';

// Định nghĩa schema cho OTP
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiry_time: { type: Date, required: true }
});

// Tạo model cho OTP
const OTP = mongoose.model('OTP', otpSchema);

// Hàm tạo OTP
export const create_confirm_otp = async (email, otp) => {
    try {
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + 1 * 60000);

        console.log("checkemail", email);

        // Kiểm tra xem email đã tồn tại trong bảng OTP chưa
        const existingOtp = await OTP.findOne({ email });

        if (existingOtp) {
            return { message: 'Email already exists!' };
        }

        // Tạo một mục OTP mới
        await OTP.create({
            email,
            otp,
            createdAt: currentTime,
            expiry_time: expiryTime
        });

        return { message: 'OTP created successfully' };
    } catch (err) {
        throw new Error(err.message || 'Server error');
    }
};

// Hàm xóa bản ghi hết hạn hiện tại
export const deleteExpiredRecordNow = async (email) => {
    try {
        await OTP.deleteMany({ email });
        console.log(`Expired records deleted successfully for ${email}.`);
    } catch (error) {
        console.error('Error deleting expired records:', error);
    }
};

// Hàm xóa bản ghi hết hạn
export const deleteExpiredRecords = async (email) => {
    const currentTime = new Date();
    try {
        await OTP.deleteMany({
            email,
            expiry_time: { $lt: currentTime }
        });
        console.log(`Expired records deleted successfully for ${email}.`);
    } catch (error) {
        console.error('Error deleting expired records:', error);
    }
};

// Hàm đọc xác nhận OTP
export const read_confirm_otp = async (email, otp) => {
    try {
        const data = await OTP.findOne({ email });

        if (!data) {
            return { success: false, message: 'Email does not match' };
        }

        if (data.otp === otp) {
            return { success: true, message: 'Email and OTP match found' };
        } else {
            return { success: false, message: 'Email exists but OTP does not match' };
        }
    } catch (error) {
        throw new Error('Server error');
    }
};
