
import nodemailer from 'nodemailer';
import 'dotenv/config';
const Email = options => {
    let transpoter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },
    });

    transpoter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log('Thanh Cong');
        }
    });
};


const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}`,
    };

    try {
        await Email(mailOptions);

        console.log('OTP email sent successfully.');
        return true;
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        return false;
    }
};
export default sendOtpEmail;

