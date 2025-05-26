import { INTERNAL_SERVER_ERROR } from "./apiResponseCode.js";
import { ApiError } from "./ApiError.js";
import {generateAccessToken, generateRefershToken} from "./utilities.js"; 
import Admin from "../models/admin.js";

const generateAccessAndRefreshTokenForUser = async (user) => {
    try {
        const accessToken = await generateAccessToken(user, user.role)
        const refreshToken = await generateRefershToken(user, user.role)
        return {accessToken, refreshToken}
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, err.message)
    }
}

const generateAccessAndRefreshTokenForAdmin = async (admin) => {
    try {
        const existedAdmin = await Admin.findById(admin._id)
        const accessToken = await generateAccessToken(admin, "ADMIN")
        const refreshToken = await generateRefershToken(admin)
        existedAdmin.refreshToken = refreshToken;
        await existedAdmin.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch (err) {
        throw new ApiError(INTERNAL_SERVER_ERROR, err.message)
    }
}

export {
    generateAccessAndRefreshTokenForUser,
    generateAccessAndRefreshTokenForAdmin
}
