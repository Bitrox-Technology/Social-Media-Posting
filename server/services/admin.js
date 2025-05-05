import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshTokenForAdmin, generateAccessAndRefreshTokenForUser } from "../utils/generateToken.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import { comparePasswordUsingBcrypt, Hashed_Password, isEmail } from "../utils/utilities.js";
import { generateOTPForEmail, verifyEmailOTP } from "../utils/functions.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";
import Admin from "../models/admin.js";

const signup = async (inputs) => {
    let admin;
    if (isEmail(inputs.email)) {
        if (!inputs.password) throw new ApiError(BAD_REQUEST, "Password is required")
        inputs.password = await Hashed_Password(inputs.password)
        admin = await Admin.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        })
        if (!admin) {
            admin = await Admin.findOne({
                email: inputs.email, isDeleted: false
            })
            if (admin) {
                await Admin.deleteMany({
                    email: inputs.email,
                    isDeleted: false,
                    isEmailVerify: false,
                });
            }

            admin = await Admin.create(inputs);
            console.log("admin", admin)
            await generateOTPForEmail(inputs.email, admin.role)
            return admin
        } else {
            throw new ApiError(BAD_REQUEST, "Email already exists")
        }
    }
}

const verifyOTP = async (inputs) => {
    let admin;
    let subObj = {}

    if (isEmail(inputs.email)) {
        admin = await Admin.findOne({
            email: inputs.email,
            isDeleted: false
        })
        if (!admin) throw new ApiError(BAD_REQUEST, "Invalid email")
        let otp = await verifyEmailOTP(inputs.email, inputs.otp)

        if (otp === false) throw new ApiError(BAD_REQUEST, "Invalid OTP")
        subObj.isEmailVerify = true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForAdmin(admin._id)
    subObj.refreshToken = refreshToken
    admin = await Admin.findByIdAndUpdate({ _id: admin._id }, subObj).lean()

    admin = await Admin.findById({ _id: admin._id }).lean()

    admin.accessToken = accessToken;
    admin.type = "Bearer";
    admin.refreshToken = refreshToken;

    return admin;
}

const resendOTP = async (inputs) => {
    let admin;
    if (Utils.isEmail(inputs.email)) {
        admin = await Admin.findOne({ email: inputs.email, isDeleted: false })

        if (admin) {
            await generateOTPForEmail(inputs.email, admin.role)
        } else {
            throw new ApiError(BAD_REQUEST, "Invalid email")
        }
    }
}

const forgetPassword = async (inputs) => {
    let admin;
    if (Utils.isEmail(inputs.email)) {

        admin = await Admin.findOne({
            email: inputs.email,
            isDeleted: false,
            isEmailVerify: true
        });
        if (!user) throw new ApiError(BAD_REQUEST, "Invalid email")
        inputs.newPassword = await Utils.Hashed_Password(inputs.newPassword)

        admin = await Admin.findByIdAndUpdate({ _id: admin._id }, { password: inputs.newPassword })

        await generateOTPForEmail(admin.email);
    }
}


const login = async (inputs) => {
    let admin;
    if (isEmail(inputs.email)) {
        admin = await Admin.findOne({ email: inputs.email, isDeleted: false }).select("+password")
        if (!admin) throw new ApiError(BAD_REQUEST, "Invalid user")
        let compare = await comparePasswordUsingBcrypt(inputs.password, admin.password);
        if (!compare) throw new ApiError(BAD_REQUEST, "Invalid password")

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokenForAdmin(admin._id)
        admin = await Admin.findByIdAndUpdate({ _id: admin._id }, { refreshToken: refreshToken }).lean()
        admin = await Admin.findById({ _id: admin._id }).lean()

        admin.accessToken = accessToken;
        admin.type = "Bearer";
        admin.refreshToken = refreshToken;
        return admin
    }
}


const logout = async (admin) => {
    return await Admin.findByIdAndUpdate({
        _id: admin._id,
        isDeleted: false
    }, {
        $set: { refreshToken: "" }
    }, {
        new: true
    }).select("+refreshToken")

}

const adminProfile = async (inputs, admin, file) => {

    // if (!file) throw new ApiError(BAD_REQUEST, "Logo is required");

    // let logoUrl = await uploadOnClodinary(file.path, "logo")
    // if (!logoUrl) throw new ApiError(BAD_REQUEST, "Unable to upload logo")

    // inputs.logo = logoUrl.secure_url
    // inputs.isProfileCompleted = true

    // let updateUser = await User.findOne({ _id: user._id, email: inputs.email, isEmailVerify: true, isDeleted: false })
    // if (!updateUser) throw new ApiError(BAD_REQUEST, "User not found")

    // updateUser = await User.findByIdAndUpdate({ _id: updateUser._id }, inputs, { new: true })
    // if (!updateUser) throw new ApiError(BAD_REQUEST, "Unable to update user details")

    // updateUser = await User.findById({ _id: updateUser._id })
    // return updateUser
}

const getAdminProfile = async (admin) => {
    const adminProfile = await Admin.findById(admin._id).lean();

    if (!adminProfile) {
        throw new ApiError(BAD_REQUEST, 'Admin not found');
    }
    return adminProfile;
}


const AdminServices = {
    signup,
    verifyOTP,
    resendOTP,
    forgetPassword,
    login,
    logout,
    adminProfile,
    getAdminProfile
}

export default AdminServices;