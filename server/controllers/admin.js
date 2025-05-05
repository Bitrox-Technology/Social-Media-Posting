import { OK } from "../utils/apiResponseCode.js";
import { ApiResponse } from "../utils/apiResponse.js";
import AdnminValidation from "../validations/admin";
import AdminServices from "../services/admin.js";
const Signup = async (req, res, next) => {
    try {
        await AdnminValidation.validateSignup(req.body)
        let user = await AdminServices.signup(req.body)
        return res.status(OK).json(new ApiResponse(OK, {email: user.email}, "OTP send successfully"))
    } catch (error) {
        next(error)
    }

}

const VerifyOTP = async (req, res, next) => {
    try {
        await AdnminValidation.validateOTP(req.body)
        let user = await AdminServices.verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User verified successfully"))
    } catch (error) {
        next(error)
    }

}

const ResendOTP = async (req, res, next) => {
    try {
        await AdnminValidation.validateResendOTP(req.body);
        let user = await AdminServices.resendOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "OTP resent successfully"))
    } catch (error) {
        next(error)
    }
}

const ForgetPassword = async (req, res, next) => {
    try {
        await AdnminValidation.validateforgetPassword(req.body)
        let user = await AdminServices.forgetPassword(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "Password reset successfully"))
    } catch (error) {
        next(error)
    }
}


const Logout = async (req, res, next) => {
    try {
        let user = await AdnminValidation.logout(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "User Logout Successfully"))
    } catch (error) {
        next(error)
    }
}

const UserDetails = async (req, res, next) => {
    console.log("UserDetails", req.body, req.user, req.file)
    try {
        await AdnminValidation.validateUserProfile(req.body)
        // let user = await AdminServices.userDetails(req.body, req.user, req.file)
        return res.status(OK).json(new ApiResponse(OK, user, "User details saved successfully"))
    } catch (error) {
        next(error)
    }

}

const GetAdminProfile = async (req, res, next) => {
    try {
        let user = await AdminServices.getUserProfile(req.user)
        return res.status(OK).json(new ApiResponse(OK, user, "User profile fetched successfully"))
    } catch (error) {
        next(error)
    }

}

const Login = async (req, res, next) => {
    try {
        await AdnminValidation.validateLogin(req.body)
        let user = await AdminServices.login(req.body)
        return res.status(OK).json(new ApiResponse(OK, user, "User Login Successfully"))
    } catch (error) {
        next(error)
    }
}
const AdminControllers = {
    Signup,
    VerifyOTP,
    ResendOTP,
    ForgetPassword,
    Logout,
    UserDetails,
    GetAdminProfile,
    Login
}
export default AdminControllers