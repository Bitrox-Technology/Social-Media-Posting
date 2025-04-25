import { generateOTP } from "./utilities.js";
import OTP from "../models/otp.js";
import { sendOtp } from "../services/sendOTP.js";
import { ApiError } from "./ApiError.js";
import { BAD_REQUEST } from "./apiResponseCode.js";
import moment from "moment";

const generateOTPForEmail = async (email) => {
    let otpCode = 1234;
    otpCode = generateOTP();
    try {
        await OTP.deleteMany({ email: email });
        let data = {
            email: email,
            otp: otpCode,
            expiredAt: moment().add(10, "minutes").toDate()
        }
        await sendOtp(email, otpCode)
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
                { email, otp }
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
        console.log(err)
        return false
    }

}

export { generateOTPForEmail, verifyEmailOTP }