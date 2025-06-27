import { generateOTP } from "./utilities.js";
import OTP from "../models/otp.js";
import { sendOtp, sendOtpForAdmin } from "../services/sendOTP.js";
import { ApiError } from "./ApiError.js";
import { BAD_REQUEST } from "./apiResponseCode.js";
import moment from "moment";

const generateOTPForEmail = async (email, role) => {
    let otpCode = 123456;
    otpCode = generateOTP();
    try {
        await OTP.deleteMany({ email: email });
        let data = {
            email: email,
            otp: otpCode,
            expiredAt: moment().add(10, "minutes").toDate()
        }
        if (role == "ADMIN") {
           await sendOtpForAdmin(email, otpCode)
        } else {
           await sendOtp(email, otpCode)
        }
        let otp = await OTP.create(data)
        return otp
    } catch (error) {
        throw new ApiError(BAD_REQUEST, err)
    }
}

const verifyEmailOTP = async (email, otp) => {
    try {
        const storedOTP = await OTP.findOne({
            $or: [
                { email, otp, expiredAt: { $gt: new Date() } }
            ]
        })
        if (storedOTP) {
            await OTP.deleteOne({
                $or: [
                    { email, otp },
                ],
            });
            return true;
        }
    } catch (err) {
        return false
    }

}

export { generateOTPForEmail, verifyEmailOTP }