import { OK } from "../utils/apiResponseCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AdnminValidation from "../validations/admin.js";
import AdminServices from "../services/admin.js";
const Signup = async (req, res, next) => {
    try {
        await AdnminValidation.validateSignup(req.body)
        let admin = await AdminServices.signup(req.body)
        return res.status(OK).json(new ApiResponse(OK, {email: admin.email}, "OTP send successfully"))
    } catch (error) {
        next(error)
    }

}

const VerifyOTP = async (req, res, next) => {
    try {
        await AdnminValidation.validateOTP(req.body)
        let admin = await AdminServices.verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, "Admin verified successfully"))
    } catch (error) {
        next(error)
    }

}

const ResendOTP = async (req, res, next) => {
    try {
        await AdnminValidation.validateResendOTP(req.body);
        let admin = await AdminServices.resendOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, "OTP resent successfully"))
    } catch (error) {
        next(error)
    }
}

const ForgetPassword = async (req, res, next) => {
    try {
        await AdnminValidation.validateforgetPassword(req.body)
        let admin = await AdminServices.forgetPassword(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, "Password reset successfully"))
    } catch (error) {
        next(error)
    }
}


const Logout = async (req, res, next) => {
    try {
        let admin = await AdnminValidation.logout(req.admin)
        return res.status(OK).json(new ApiResponse(OK, admin, "Admin Logout Successfully"))
    } catch (error) {
        next(error)
    }
}

const UpdateAdminProfile = async (req, res, next) => {
    try {
        await AdnminValidation.validateAdminProfile(req.body)
        let admin = await AdminServices.updateAdminProfile(req.body, req.admin, req.file)
        return res.status(OK).json(new ApiResponse(OK, admin, "Admin details updated successfully"))
    } catch (error) {
        next(error)
    }

}

const GetAdminProfile = async (req, res, next) => {
    try {
        let admin = await AdminServices.getAdminProfile(req.admin)
        return res.status(OK).json(new ApiResponse(OK, admin, "Admin profile fetched successfully"))
    } catch (error) {
        next(error)
    }

}

const Login = async (req, res, next) => {
    try {
        await AdnminValidation.validateLogin(req.body)
        let admin = await AdminServices.login(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, "Admin Login Successfully"))
    } catch (error) {
        next(error)
    }
}

const GetAllUsers = async (req, res, next) => {
    try {
        let users = await AdminServices.getAllUsers(req.query)
        return res.status(OK).json(new ApiResponse(OK, users, "All users fetched successfully"))
    } catch (error) {
        next(error)
    }
}

const GetUserById = async (req, res, next) => {
    try {
        let user = await AdminServices.getUserById(req.params.userId)
        return res.status(OK).json(new ApiResponse(OK, user, "User fetched successfully"))
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
    UpdateAdminProfile,
    GetAdminProfile,
    Login,
    GetAllUsers,
    GetUserById
}
export default AdminControllers