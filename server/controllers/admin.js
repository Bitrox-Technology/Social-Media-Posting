import { OK } from "../utils/apiResponseCode.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AdnminValidation from "../validations/admin.js";
import AdminServices from "../services/admin.js";
const Signup = async (req, res, next) => {
    try {
        await AdnminValidation.validateSignup(req.body)
        let admin = await AdminServices.signup(req.body)
        return res.status(OK).json(new ApiResponse(OK, { email: admin.email }, i18n.__("OTP_SEND_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const VerifyOTP = async (req, res, next) => {
    try {
        await AdnminValidation.validateOTP(req.body)
        let admin = await AdminServices.verifyOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_VERFIED_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const ResendOTP = async (req, res, next) => {
    try {
        await AdnminValidation.validateResendOTP(req.body);
        let admin = await AdminServices.resendOTP(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("OTP_RESENT_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const ForgetPassword = async (req, res, next) => {
    try {
        await AdnminValidation.validateforgetPassword(req.body)
        let admin = await AdminServices.forgetPassword(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("PASSWORD_RESET_SUCCESS")))
    } catch (error) {
        next(error)
    }
}


const Logout = async (req, res, next) => {
    try {
        let admin = await AdnminValidation.logout(req.admin)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_LOGOUT_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const UpdateAdminProfile = async (req, res, next) => {
    try {
        await AdnminValidation.validateAdminProfile(req.body)
        let admin = await AdminServices.updateAdminProfile(req.body, req.admin, req.file)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_PROFILE_UPDATED_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const GetAdminProfile = async (req, res, next) => {
    try {
        let admin = await AdminServices.getAdminProfile(req.admin)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_PROFILE_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }

}

const Login = async (req, res, next) => {
    try {
        await AdnminValidation.validateLogin(req.body)
        let admin = await AdminServices.login(req.body)
        return res.status(OK).json(new ApiResponse(OK, admin, i18n.__("ADMIN_LOGIN_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const GetAllUsers = async (req, res, next) => {
    try {
        let users = await AdminServices.getAllUsers(req.query)
        return res.status(OK).json(new ApiResponse(OK, users, i18n.__("USERS_FETCHED_SUCCESS")))
    } catch (error) {
        next(error)
    }
}

const GetUserById = async (req, res, next) => {
    try {
        let user = await AdminServices.getUserById(req.params)
        return res.status(OK).json(new ApiResponse(OK, user, i18n.__("USER_FETCHED_SUCCESS")))
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