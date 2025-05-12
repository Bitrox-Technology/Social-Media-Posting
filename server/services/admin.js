import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshTokenForAdmin, generateAccessAndRefreshTokenForUser } from "../utils/generateToken.js";
import { BAD_REQUEST } from "../utils/apiResponseCode.js";
import { comparePasswordUsingBcrypt, Hashed_Password, isEmail } from "../utils/utilities.js";
import { generateOTPForEmail, verifyEmailOTP } from "../utils/functions.js";
import { uploadOnClodinary } from "../utils/cloudinary.js";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import { getPagination } from "../utils/utilities.js";
import mongoose from "mongoose";


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
        if (!admin) throw new ApiError(BAD_REQUEST, "Invalid Admin")
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

const updateAdminProfile = async (inputs, admin, file) => {
    let updateAdmin;
    if (!file) throw new ApiError(BAD_REQUEST, "Profile image is required")

    let image = await uploadOnClodinary(file.path, "admin-profile-image")
    if (!image) throw new ApiError(BAD_REQUEST, "Image not uploaded")

    inputs.profileImage = image.secure_url
    inputs.isProfileCompleted = true

    updateAdmin = await Admin.findByIdAndUpdate({ _id: admin._id }, inputs, { new: true }).lean()
    if (!updateAdmin) throw new ApiError(BAD_REQUEST, "Admin not found")

    updateAdmin = await Admin.findById({ _id: admin._id }).lean()

    return updateAdmin

}

const getAdminProfile = async (admin) => {
    const adminProfile = await Admin.findById(admin._id).lean();

    if (!adminProfile) {
        throw new ApiError(BAD_REQUEST, 'Admin not found');
    }
    return adminProfile;
}

const getAllUsers = async (query) => {
    const total = await User.countDocuments();

    const pagination = getPagination(query, total);

    const users = await User.find()
        .select('userName email status role subscription createdAt isDeleted')
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean()


    if (!users || users.length === 0) {
        throw new ApiError(BAD_REQUEST, 'No users found');
    }
    return {
        users,
        pagination,
    };
}

const getUserById = async (param) => {
    const result = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(param.userId),
          },
        },
        
        {
          $lookup: {
            from: 'saveposts', 
            localField: '_id',
            foreignField: 'userId',
            as: 'posts',
          },
        },
        
        {
          $project: {
            userName: 1,
            email: 1,
            countryCode: 1,
            phone: 1,
            location: 1,
            logo: 1,
            companyName: 1,
            services: 1,
            keyProducts: 1,
            targetMarket: 1,
            websiteUrl: 1,
            isProfileCompleted: 1,
            role: 1,
            subscription: 1,
            status: 1,
            bio: 1,
            isEmailVerify: 1,
            isDeleted: 1,
            isBlocked: 1,
            productCategories: 1,
            createdAt: 1,
            updatedAt: 1,
            posts: {
              $map: {
                input: '$posts',
                as: 'post',
                in: {
                  topic: '$$post.topic',
                  type: '$$post.type',
                  status: '$$post.status',
                  images: '$$post.images',
                  createdAt: '$$post.createdAt',
                },
              },
            },
          },
        },
      ]).exec();

      if (!result || result.length === 0) {
        throw new ApiError(BAD_REQUEST, 'User not found');
      }
    
      return result[0];
}


const AdminServices = {
    signup,
    verifyOTP,
    resendOTP,
    forgetPassword,
    login,
    logout,
    updateAdminProfile,
    getAdminProfile,
    getAllUsers,
    getUserById
}

export default AdminServices;